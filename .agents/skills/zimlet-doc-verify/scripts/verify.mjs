#!/usr/bin/env node
// Runs documentation examples and commands in a scratch Zimlet project and prints one result:
// Verified, Failed or Cannot verify. No dependencies; run with Node 24.
import { spawn, spawnSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import https from 'node:https';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const boilerplate = path.join(here, '..', 'assets', 'boilerplate');

const MAX_OUTPUT = 3000;
const tail = text => (text.length > MAX_OUTPUT ? '...' + text.slice(-MAX_OUTPUT) : text);
const strip = text => text.replace(/\x1b\[[0-9;]*m/g, '');

function finish(status, command, output, extra = '') {
	console.log(`RESULT: ${status}`);
	if (command) console.log(`COMMAND: ${command}`);
	if (extra) console.log(extra);
	if (output) console.log(`OUTPUT:\n${tail(strip(output)).trim()}`);
	process.exit(status === 'Verified' ? 0 : status === 'Failed' ? 1 : 2);
}

function cannot(reason, needed) {
	finish('Cannot verify', '', '', `REASON: ${reason}\nNEEDED: ${needed}`);
}

function requireNode24() {
	const major = Number(process.versions.node.split('.')[0]);
	if (major !== 24) {
		cannot(`Running on Node ${process.versions.node}`, 'Node 24 (for example `nvm use 24`), which every Zimlet repo requires');
	}
}

function run(cmd, args, cwd, timeout = 300000) {
	const r = spawnSync(cmd, args, { cwd, encoding: 'utf8', timeout, shell: false });
	return { code: r.status, output: (r.stdout || '') + (r.stderr || '') };
}

function copyDir(from, to) {
	fs.mkdirSync(to, { recursive: true });
	for (const entry of fs.readdirSync(from, { withFileTypes: true })) {
		const src = path.join(from, entry.name);
		const dest = path.join(to, entry.name);
		if (entry.isDirectory()) copyDir(src, dest);
		else fs.copyFileSync(src, dest);
	}
}

// Documentation examples carry tag::/end:: comments for Antora; they are not part of the code.
function stripTags(source) {
	return source
		.split('\n')
		.filter(line => !/^\s*\/\/\s*(tag|end)::/.test(line) && !/^\s*<!--\s*(tag|end)::/.test(line))
		.join('\n');
}

function installExample(dir, example, as) {
	if (!example) return;
	if (!fs.existsSync(example)) cannot(`Example file not found: ${example}`, 'a valid path');
	const target = path.join(dir, as || 'src/index.js');
	fs.mkdirSync(path.dirname(target), { recursive: true });
	fs.writeFileSync(target, stripTags(fs.readFileSync(example, 'utf8')));
}

function option(args, name) {
	const i = args.indexOf(name);
	return i === -1 ? undefined : args[i + 1];
}

const commands = {
	// scratch [dir]: copy the boilerplate and install the CLI.
	scratch(args) {
		requireNode24();
		const dir = args[0] || fs.mkdtempSync(path.join(os.tmpdir(), 'zimlet-verify-'));
		copyDir(boilerplate, dir);
		const r = run('npm', ['install', '--no-audit', '--no-fund'], dir);
		if (r.code !== 0) finish('Failed', 'npm install', r.output, `DIR: ${dir}`);
		const version = run('npx', ['zimlet', '--version'], dir);
		finish('Verified', 'npm install', version.output, `DIR: ${dir}\nCLI VERSION: ${version.output.trim()}`);
	},

	// build <dir> [--example file] [--as src/index.js]
	build(args) {
		requireNode24();
		const dir = args[0];
		installExample(dir, option(args, '--example'), option(args, '--as'));
		const r = run('npx', ['zimlet', 'build'], dir);
		const files = fs.existsSync(path.join(dir, 'build')) ? fs.readdirSync(path.join(dir, 'build')).join(', ') : '(none)';
		finish(r.code === 0 ? 'Verified' : 'Failed', 'npx zimlet build', r.output, `BUILD FILES: ${files}`);
	},

	// package <dir> [--example file] [--as path]: build, then package with the boilerplate script.
	package(args) {
		requireNode24();
		const dir = args[0];
		installExample(dir, option(args, '--example'), option(args, '--as'));
		const b = run('npx', ['zimlet', 'build'], dir);
		if (b.code !== 0) finish('Failed', 'npx zimlet build', b.output);
		const r = run('npm', ['run', 'package'], dir);
		let extra = '';
		const pkg = path.join(dir, 'pkg');
		if (fs.existsSync(pkg)) {
			const zip = fs.readdirSync(pkg).find(f => f.endsWith('.zip'));
			if (zip) {
				extra += `ZIP: pkg/${zip}\n` + run('unzip', ['-l', path.join(pkg, zip)], dir).output;
			}
		}
		const xml = fs.readdirSync(path.join(dir, 'build')).find(f => f.endsWith('.xml'));
		if (xml) extra += `DESCRIPTOR build/${xml}:\n${fs.readFileSync(path.join(dir, 'build', xml), 'utf8')}`;
		finish(r.code === 0 ? 'Verified' : 'Failed', 'npm run package', r.output, extra);
	},

	// watch <dir> [--port 8199] [--example file]: start the dev server, fetch index.js, edit, check the rebuild.
	async watch(args) {
		requireNode24();
		const dir = args[0];
		const port = option(args, '--port') || '8199';
		installExample(dir, option(args, '--example'), option(args, '--as'));
		const log = [];
		const child = spawn('npx', ['zimlet', 'watch', '--port', port], { cwd: dir, detached: true });
		const collect = d => log.push(strip(d.toString()));
		child.stdout.on('data', collect);
		child.stderr.on('data', collect);
		const stop = () => {
			try {
				process.kill(-child.pid);
			} catch (e) {}
		};
		const waitFor = async (test, ms) => {
			const end = Date.now() + ms;
			while (Date.now() < end) {
				if (test()) return true;
				await new Promise(r => setTimeout(r, 500));
			}
			return false;
		};
		const fetchIndex = scheme =>
			new Promise(resolve => {
				if (scheme === 'http') return resolve({ error: 'not tried' });
				https
					.get({ host: 'localhost', port, path: '/index.js', rejectUnauthorized: false }, res => {
						let body = '';
						res.on('data', c => (body += c));
						res.on('end', () => resolve({ status: res.statusCode, body, cors: res.headers['access-control-allow-origin'] }));
					})
					.on('error', e => resolve({ error: e.message }));
			});

		if (!(await waitFor(() => log.join('').includes('Compiled successfully'), 120000))) {
			stop();
			finish('Failed', `npx zimlet watch --port ${port}`, log.join(''), 'The first compile did not finish in 120 s.');
		}
		const first = await fetchIndex('https');
		const printed = (log.join('').match(/Local:\s+(\S+)/) || [])[1] || '(none)';
		const marker = `verify-${Date.now()}`;
		const entry = path.join(dir, 'src', 'index.js');
		// A string literal survives the build; a comment would be stripped.
		fs.appendFileSync(entry, `\nconsole.log('${marker}');\n`);
		let rebuilt = false;
		if (await waitFor(() => log.join('').split('Compiled successfully').length > 2, 60000)) {
			const second = await fetchIndex('https');
			rebuilt = !!second.body && second.body.includes(marker);
		}
		stop();
		const ok = first.status === 200 && rebuilt;
		finish(
			ok ? 'Verified' : 'Failed',
			`npx zimlet watch --port ${port}`,
			log.join(''),
			`HTTPS GET /index.js: status ${first.status || first.error}, CORS header ${first.cors || '(none)'}\nURL PRINTED BY THE CLI: ${printed}\nREBUILT AFTER EDIT: ${rebuilt}`
		);
	},

	// lint-i18n <dir> <file>: run the template's preact-i18n rule on a file.
	'lint-i18n'(args) {
		requireNode24();
		const [dir, file] = args;
		const install = run('npm', ['install', '--no-save', '--legacy-peer-deps', '--no-audit', '--no-fund', 'eslint@8', 'eslint-plugin-preact-i18n'], dir);
		if (install.code !== 0) finish('Failed', 'npm install eslint@8 eslint-plugin-preact-i18n', install.output);
		fs.writeFileSync(
			path.join(dir, 'i18n-check.cjs'),
			`module.exports = {
  root: true,
  parserOptions: { ecmaVersion: 2022, sourceType: 'module', ecmaFeatures: { jsx: true } },
  plugins: ['preact-i18n'],
  rules: { 'preact-i18n/no-text-as-children': ['error', { ignoreTextRegex: '^(?:\\\\s*[()\\ud83d\\udea9.":<>\\\\-/]\\\\s*)*$' }] },
  settings: { react: { pragma: 'createElement', version: '15.0' }, 'preact-i18n': { textComponents: [{ nameRegex: '^Text$' }] } }
};
`
		);
		const r = run('npx', ['eslint', '--no-eslintrc', '-c', 'i18n-check.cjs', file], dir);
		// ESLint exits 1 when it reports an error; that is a valid result here, not a failure of the tool.
		const ran = r.code === 0 || r.code === 1;
		finish(ran ? 'Verified' : 'Failed', `npx eslint --no-eslintrc -c i18n-check.cjs ${file}`, r.output, `RULE REPORTED PROBLEMS: ${r.code === 1}`);
	},

	// register-calls <dir>: load build/index.js with a stub host and list the plugins.register calls made by init().
	'register-calls'(args) {
		const dir = args[0];
		const bundle = path.join(dir, 'build', 'index.js');
		if (!fs.existsSync(bundle)) cannot('build/index.js does not exist', 'run the build command first');
		const calls = [];
		const handlers = [];
		const deep = () => new Proxy(function () {}, { get: (t, k) => (k === 'default' ? deep() : deep()), apply: () => deep(), construct: () => deep() });
		const context = {
			plugins: { register: (name, handler) => (calls.push(`${name} -> ${typeof handler}`), handlers.push({ name, handler })), unregister: () => {} },
			zimbra: deep(), config: {}, shims: deep(), components: deep(), store: deep(), meta: {},
			styles: { set() {}, remove() {} }
		};
		let factory;
		const sandbox = { zimlet: f => (factory = f), console, window: {} };
		sandbox.global = sandbox;
		sandbox.self = sandbox;
		try {
			vm.runInNewContext(fs.readFileSync(bundle, 'utf8'), sandbox, { filename: 'build/index.js' });
			const handler = factory(context);
			const before = calls.length;
			if (handler && typeof handler.init === 'function') handler.init();
			// With --invoke each registered handler is called once with empty props, like a slot would.
			let invoked = '';
			if (args.includes('--invoke')) {
				invoked = '\nINVOKED HANDLERS:';
				for (const { name, handler: h } of handlers) {
					try {
						if (typeof h === 'function') h({});
						invoked += `\n  ${name}: ok`;
					} catch (e) {
						invoked += `\n  ${name}: threw ${e && e.name}: ${e && e.message}`;
					}
				}
			}
			finish('Verified', 'load build/index.js with a stub host, then call the factory and init()', '', `REGISTERED IN FACTORY: ${calls.slice(0, before).join('; ') || '(none)'}\nREGISTERED IN init(): ${calls.slice(before).join('; ') || '(none)'}${invoked}\nNOTE: a stub host, not the Modern UI; it shows which registrations are made, not how they render.`);
		} catch (e) {
			finish('Failed', 'load build/index.js with a stub host', String(e && e.stack ? e.stack : e));
		}
	}
};

const [name, ...rest] = process.argv.slice(2);
if (!commands[name]) {
	console.log(`Usage: verify.mjs <command> ...
  scratch [dir]                         create a scratch project and install the CLI
  build <dir> [--example f] [--as p]    build (optionally with an example file as src/index.js)
  package <dir> [--example f]           build and package; lists the zip and the descriptor
  watch <dir> [--port n] [--example f]  start the dev server, fetch index.js, edit, check the rebuild
  lint-i18n <dir> <file>                run the preact-i18n no-text-as-children rule on a file
  register-calls <dir> [--invoke]       list plugins.register calls made by a built bundle (stub host); --invoke also calls each handler`);
	process.exit(2);
}
await commands[name](rest);
