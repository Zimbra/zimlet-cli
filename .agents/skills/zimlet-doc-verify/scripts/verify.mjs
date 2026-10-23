#!/usr/bin/env node
// Sets up the scratch Zimlet project and runs the Zimlet documentation checks that need a dev server or a loaded bundle.
// Prints one result: Verified, Failed or Cannot verify. No dependencies; run with Node 24.
// Build, package and lint are run directly with the commands in SKILL.md.
import { spawn, spawnSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import https from 'node:https';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
// This script is in <zimlet-cli>/.agents/skills/zimlet-doc-verify/scripts; the repositories are siblings.
const siblings = path.resolve(here, '../../../../..');
const defaultScratch = path.join(siblings, 'zimlet-verify');
const templateDir = path.join(siblings, 'zm-x-zimlet-template-default', 'template');
const SCRATCH_NAME = 'my-zimlet';
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
	const version = /^24\.(\d+)\.\d+$/.exec(process.versions.node);
	if (!version || Number(version[1]) < 18) {
		cannot(
			`Running on Node ${process.versions.node}`,
			'Node ^24.18.0 (for example `nvm use 24`), which every Zimlet repo requires'
		);
	}
}

// Documentation examples carry tag::/end:: comments for Antora; they are not part of the code.
function stripTags(source) {
	return source
		.split('\n')
		.filter(line => !/^\s*\/\/\s*(tag|end)::/.test(line) && !/^\s*<!--\s*(tag|end)::/.test(line))
		.join('\n');
}

// Copies every file of a folder example, so relative imports such as ./components/Name resolve.
function copyExample(from, to) {
	for (const entry of fs.readdirSync(from, { withFileTypes: true })) {
		const source = path.join(from, entry.name);
		const target = path.join(to, entry.name);
		if (entry.isDirectory()) {
			copyExample(source, target);
		} else {
			fs.mkdirSync(to, { recursive: true });
			fs.writeFileSync(target, stripTags(fs.readFileSync(source, 'utf8')));
		}
	}
}

function installExample(dir, example, as) {
	if (!example) return;
	if (!fs.existsSync(example)) cannot(`Example not found: ${example}`, 'a valid file or folder path');
	if (fs.statSync(example).isDirectory()) {
		copyExample(example, path.join(dir, as || 'src'));
		return;
	}
	const target = path.join(dir, as || 'src/index.js');
	fs.mkdirSync(path.dirname(target), { recursive: true });
	fs.writeFileSync(target, stripTags(fs.readFileSync(example, 'utf8')));
}

// Copies the template into the scratch folder and replaces {{name}} like `zimlet create` does.
function copyTemplate(from, to) {
	for (const entry of fs.readdirSync(from, { withFileTypes: true })) {
		if (['node_modules', '.git', 'build', 'pkg'].includes(entry.name)) continue;
		const source = path.join(from, entry.name);
		const target = path.join(to, entry.name);
		if (entry.isDirectory()) {
			fs.mkdirSync(target, { recursive: true });
			copyTemplate(source, target);
			continue;
		}
		const data = fs.readFileSync(source);
		fs.writeFileSync(
			target,
			data.includes(0) ? data : data.toString('utf8').replace(/\{\{\s*name\s*\}\}/g, SCRATCH_NAME),
			{ mode: fs.statSync(source).mode }
		);
	}
}

// An example replaces the template's code; only src/intl is kept, so the project holds the example and nothing else.
function resetSource(dir) {
	const src = path.join(dir, 'src');
	for (const entry of fs.existsSync(src) ? fs.readdirSync(src) : []) {
		if (entry !== 'intl') fs.rmSync(path.join(src, entry), { recursive: true, force: true });
	}
}

function listFiles(dir, base = dir) {
	return fs
		.readdirSync(dir, { withFileTypes: true })
		.flatMap(e =>
			e.isDirectory() ? listFiles(path.join(dir, e.name), base) : [path.relative(base, path.join(dir, e.name))]
		);
}

function option(args, name) {
	const i = args.indexOf(name);
	return i === -1 ? undefined : args[i + 1];
}

const hasCli = dir => fs.existsSync(path.join(dir, 'node_modules', '.bin', 'zimlet'));

const commands = {
	// scratch [--dir d]: create the scratch project from the default template and install it, or reuse it.
	scratch(args) {
		requireNode24();
		const dir = path.resolve(option(args, '--dir') || defaultScratch);
		if (!fs.existsSync(path.join(templateDir, 'eslint.config.mjs'))) {
			cannot(
				`${templateDir} is missing or is not the refreshed default template (it has no eslint.config.mjs)`,
				'the sibling checkout zm-x-zimlet-template-default on the branch PREAPPS-9862 (or after the merge, master)'
			);
		}
		if (hasCli(dir) && !fs.existsSync(path.join(dir, '.prettierrc'))) {
			cannot(
				`${dir} was made by an earlier version of this skill from a different boilerplate`,
				`rm -rf "${dir}", then run this command again`
			);
		}
		let install = '';
		if (!hasCli(dir)) {
			fs.mkdirSync(dir, { recursive: true });
			copyTemplate(templateDir, dir);
			const r = spawnSync('npm', ['install', '--no-audit', '--no-fund'], { cwd: dir, encoding: 'utf8' });
			install = (r.stdout || '') + (r.stderr || '');
			if (r.status !== 0) finish('Failed', 'npm install', install, `SCRATCH: ${dir}`);
		}
		const v = spawnSync('npx', ['zimlet', '--version'], { cwd: dir, encoding: 'utf8' });
		if (v.status !== 0) finish('Failed', 'npx zimlet --version', (v.stdout || '') + (v.stderr || ''), `SCRATCH: ${dir}`);
		finish(
			'Verified',
			install ? 'copy the template, replace {{name}}, npm install, npx zimlet --version' : 'npx zimlet --version',
			install,
			`SCRATCH: ${dir}\nTEMPLATE: ${templateDir}\nZIMLET CLI: ${v.stdout.trim()}`
		);
	},

	// example <file|folder> [--dir d]: replace the scratch project's src/ with a documentation example.
	example(args) {
		const example = args[0] && !args[0].startsWith('--') ? path.resolve(args[0]) : undefined;
		if (!example) cannot('No example given', 'a path to an example file or folder');
		const dir = path.resolve(option(args, '--dir') || defaultScratch);
		if (!hasCli(dir)) cannot(`No scratch project in ${dir}`, 'run `verify.mjs scratch` first');
		resetSource(dir);
		installExample(dir, example);
		finish(
			'Verified',
			`copy ${example} into ${path.join(dir, 'src')}`,
			'',
			`FILES IN src/:\n${listFiles(path.join(dir, 'src')).join('\n')}`
		);
	},

	// watch <dir> [--port 8199] [--example file|dir]: start the dev server, fetch index.js, edit, check the rebuild.
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
						res.on('end', () =>
							resolve({
								status: res.statusCode,
								body,
								cors: res.headers['access-control-allow-origin']
							})
						);
					})
					.on('error', e => resolve({ error: e.message }));
			});

		if (!(await waitFor(() => log.join('').includes('Compiled successfully'), 120000))) {
			stop();
			finish(
				'Failed',
				`npx zimlet watch --port ${port}`,
				log.join(''),
				'The first compile did not finish in 120 s.'
			);
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

	// register-calls <dir>: load build/index.js with a stub host and list the plugins.register calls made by init().
	'register-calls'(args) {
		const dir = args[0];
		const bundle = path.join(dir, 'build', 'index.js');
		if (!fs.existsSync(bundle))
			cannot('build/index.js does not exist', 'run the build command first');
		const calls = [];
		const handlers = [];
		const deep = () =>
			new Proxy(function () {}, {
				get: (t, k) => (k === 'default' ? deep() : deep()),
				apply: () => deep(),
				construct: () => deep()
			});
		const context = {
			plugins: {
				register: (name, handler) => (
					calls.push(`${name} -> ${typeof handler}`),
					handlers.push({ name, handler })
				),
				unregister: () => {}
			},
			zimbra: deep(),
			config: {},
			shims: deep(),
			components: deep(),
			store: deep(),
			meta: {},
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
			finish(
				'Verified',
				'load build/index.js with a stub host, then call the factory and init()',
				'',
				`REGISTERED IN FACTORY: ${calls.slice(0, before).join('; ') || '(none)'}\nREGISTERED IN init(): ${calls.slice(before).join('; ') || '(none)'}${invoked}\nNOTE: a stub host, not the Modern UI; it shows which registrations are made, not how they render.`
			);
		} catch (e) {
			finish('Failed', 'load build/index.js with a stub host', String(e && e.stack ? e.stack : e));
		}
	}
};

const [name, ...rest] = process.argv.slice(2);
if (!commands[name]) {
	console.log(`Usage: verify.mjs <command> ...
  scratch [--dir d]                     create the scratch project from the default template and install it (default: ../zimlet-verify)
  example <file|folder> [--dir d]       replace the scratch project's src/ with a documentation example
  watch <dir> [--port n] [--example f|dir]  start the dev server, fetch index.js, edit, check the rebuild (a folder is copied to src/)
  register-calls <dir> [--invoke]       list plugins.register calls made by a built bundle (stub host); --invoke also calls each handler`);
	process.exit(2);
}
await commands[name](rest);
