#!/usr/bin/env node
/**
 * Scans Zimlet sources for plugin registrations (`plugins.register` / `plugins.unregister`)
 * and merges the mechanical findings into
 * .agents/context/zimlet-registration-patterns.yml without touching reviewed content.
 *
 * Usage: node .agents/scripts/scan-zimlet-registrations.mjs [--check] [--output file] [--repo name=dir ...]
 *
 * Merge contract (see .agents/reference/zimlet-registration-patterns.md):
 * - `status: scanned` entries are mechanical output and are refreshed on every run.
 * - `status: complete` entries are never modified. A difference from the fresh scan is only
 *   reported (drift). Pattern `usages` of a complete pattern are append-only.
 * - Comments and key order of the existing file are preserved.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { parse } from '@babel/parser';
import traverseModule from '@babel/traverse';
import YAML from 'yaml';

const traverse = traverseModule.default ?? traverseModule;

const SCRIPT_DIR = path.dirname(fileURLToPath(import.meta.url));
const CLI_ROOT = path.resolve(SCRIPT_DIR, '../..');
const DEFAULT_OUTPUT = path.join(CLI_ROOT, '.agents/context/zimlet-registration-patterns.yml');
let OUTPUT = DEFAULT_OUTPUT;

// Default layout: sibling repositories next to zimlet-cli (see AGENTS.md).
const DEFAULT_REPOS = [
	{ id: 'zm-modern-zimlets', dir: path.resolve(CLI_ROOT, '../zm-modern-zimlets/zimlets') },
	{ id: 'zm-cloudsuite-zimlets', dir: path.resolve(CLI_ROOT, '../zm-cloudsuite-zimlets/packages') }
];

const REGISTER_METHODS = new Set(['register', 'unregister']);
const LOOP_METHODS = new Set(['forEach', 'map', 'filter', 'reduce', 'flatMap']);
const PROMISE_METHODS = new Set(['then', 'catch', 'finally']);
const RUNTIME_CALLBACKS = new Set([
	'subscribe',
	'useEffect',
	'useCallback',
	'addEventListener',
	'on',
	'setTimeout'
]);
const REDUX_METHODS = new Set([
	'injectAsyncReducer',
	'addActions',
	'removeActions',
	'addSelectors',
	'removeSelectors',
	'addSlot',
	'removeSlot'
]);

// Skeletons used only when a pattern id is missing from the YAML. Judgment fields stay empty.
const PATTERN_SKELETONS = [
	{ id: 'slot-ui', kind: 'registration', name: 'Slot that renders UI', api: "plugins.register('slot::<name>', handler)" },
	{ id: 'slot-behavior', kind: 'registration', name: 'Slot used for behavior, not visible UI', api: "plugins.register('slot::<name>', handler)" },
	{ id: 'settings', kind: 'registration', name: 'Settings section or fields', api: "plugins.register('settings', { id, title, component, fields })" },
	{ id: 'settings-companion-slot', kind: 'registration', name: 'Slot inside a host settings section', api: "plugins.register('slot::<settings slot>', handler)" },
	{ id: 'message-processor', kind: 'registration', name: 'Message processor', api: "plugins.register('messageProcessors:<kind>', () => processor)" },
	{ id: 'vertical-route', kind: 'registration', name: 'Route, tab item or landing page of a vertical', api: "plugins.register('slot::routes' | 'slot::<vertical>-tab-item', handler)" },
	{ id: 'unclassified', kind: 'registration', name: 'Registration key not recognized by the scanner', api: '' },
	{ id: 'conditional-registration', kind: 'modifier', name: 'Registered only when a condition holds', api: '' },
	{ id: 'async-registration', kind: 'modifier', name: 'Registered after an asynchronous step', api: '' },
	{ id: 'dynamic-registration', kind: 'modifier', name: 'Registered or unregistered at runtime', api: '' },
	{ id: 'loop-registration', kind: 'modifier', name: 'Registered from a loop over configuration', api: '' },
	{ id: 'multi-handler', kind: 'modifier', name: 'Several handlers for the same key', api: '' },
	{ id: 'redux-wiring', kind: 'modifier', name: 'Redux reducers, actions, selectors or dynamic slots', api: '' },
	{ id: 'no-registration', kind: 'modifier', name: 'No plugin registration', api: '' },
	{ id: 'factory-shape', kind: 'modifier', name: 'Shape of the zimlet factory', api: '' }
];
const FACTORY_VARIANTS = { 'init-property': 'factory-init-property', 'returned-object': 'factory-returned-object' };

const HEADER = `Zimlet registration patterns: how Zimlets register with Modern UI (zm-x-web).
Entry point and conventions: ../reference/zimlet-registration-patterns.md

Merge contract (scripts/scan-zimlet-registrations.mjs):
- status "scanned": mechanical output; refreshed on every run.
- status "complete": reviewed; the script never edits it and only reports drift.
- Pattern usages of a complete pattern are append-only.
Slot and key names are recorded as the zimlet registers them; they are not checked against
the zm-x-web slot catalog.`;

function parseArgs(argv) {
	const args = { check: false, repos: [], output: undefined };
	for (let i = 0; i < argv.length; i++) {
		if (argv[i] === '--check') args.check = true;
		else if (argv[i] === '--output') args.output = path.resolve(argv[++i] ?? '');
		else if (argv[i] === '--repo') {
			const [id, dir] = String(argv[++i] ?? '').split('=');
			if (!id || !dir) throw new Error('--repo expects name=dir');
			args.repos.push({ id, dir: path.resolve(dir) });
		} else throw new Error(`Unknown argument: ${argv[i]}`);
	}
	return args;
}

function listSourceFiles(dir) {
	const out = [];
	for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
		const full = path.join(dir, entry.name);
		if (entry.isDirectory()) out.push(...listSourceFiles(full));
		else if (/\.(js|jsx|mjs)$/.test(entry.name)) out.push(full);
	}
	return out.sort();
}

function sourceText(code, node) {
	return code.slice(node.start, node.end).replace(/\s+/g, ' ').trim();
}

function shorten(text, max = 100) {
	return text.length > max ? `${text.slice(0, max - 3)}...` : text;
}

function isPluginsObject(node) {
	return (
		(node.type === 'Identifier' && node.name === 'plugins') ||
		(node.type === 'MemberExpression' && !node.computed && node.property.name === 'plugins')
	);
}

function keyText(code, node) {
	if (!node) return null;
	if (node.type === 'StringLiteral') return node.value;
	if (node.type === 'TemplateLiteral') {
		return node.quasis.map((q, i) => q.value.cooked + (node.expressions[i] ? `\${${sourceText(code, node.expressions[i])}}` : '')).join('');
	}
	return `<${sourceText(code, node)}>`;
}

function handlerInfo(node) {
	if (!node) return { handler: 'none' };
	switch (node.type) {
		case 'ArrowFunctionExpression':
		case 'FunctionExpression':
			return { handler: 'inline-function' };
		case 'Identifier':
			return { handler: 'reference', handlerRef: node.name };
		case 'JSXElement':
		case 'JSXFragment':
			return { handler: 'jsx' };
		case 'ObjectExpression':
			return { handler: 'object' };
		case 'CallExpression':
			return { handler: 'call' };
		default:
			return { handler: 'expression' };
	}
}

function settingsInfo(code, node) {
	if (!node || node.type !== 'ObjectExpression') return undefined;
	const info = { id: undefined, hasTitle: false, hasComponent: false, fields: [] };
	for (const prop of node.properties) {
		if (prop.type !== 'ObjectProperty' || prop.computed) continue;
		const name = prop.key.name ?? prop.key.value;
		if (name === 'id') info.id = keyText(code, prop.value).replace(/^<|>$/g, '');
		else if (name === 'title') info.hasTitle = true;
		else if (name === 'component') info.hasComponent = true;
		else if (name === 'fields' && prop.value.type === 'ObjectExpression') {
			for (const field of prop.value.properties) {
				if (field.type !== 'ObjectProperty') continue;
				const fieldName = field.computed ? `[${sourceText(code, field.key)}]` : field.key.name ?? field.key.value;
				let type = 'helper';
				if (field.value.type === 'ObjectExpression') {
					const typeProp = field.value.properties.find(p => p.type === 'ObjectProperty' && !p.computed && (p.key.name ?? p.key.value) === 'type');
					type = typeProp && typeProp.value.type === 'StringLiteral' ? typeProp.value.value : 'object';
				}
				info.fields.push({ name: fieldName, type });
			}
		}
	}
	return info;
}

// Guards describe the conditions and runtime context around a call, innermost first.
function collectGuards(code, callPath, thenReferenced) {
	const guards = [];
	let child = callPath;
	let parent = callPath.parentPath;
	while (parent) {
		const node = parent.node;
		const key = child.key;
		if (node.type === 'IfStatement' && (key === 'consequent' || key === 'alternate')) {
			guards.push({ kind: 'if', test: shorten(sourceText(code, node.test)) });
		} else if (node.type === 'ConditionalExpression' && (key === 'consequent' || key === 'alternate')) {
			guards.push({ kind: 'if', test: shorten(sourceText(code, node.test)) });
		} else if (node.type === 'LogicalExpression' && key === 'right') {
			guards.push({ kind: 'if', test: shorten(sourceText(code, node.left)) });
		} else if (['ForStatement', 'ForOfStatement', 'ForInStatement', 'WhileStatement'].includes(node.type) && key === 'body') {
			guards.push({ kind: 'loop' });
		} else if (node.type === 'CallExpression' && child.listKey === 'arguments' && node.callee.type === 'MemberExpression') {
			const method = node.callee.property.name;
			if (LOOP_METHODS.has(method)) guards.push({ kind: 'loop' });
			else if (PROMISE_METHODS.has(method)) guards.push({ kind: 'async' });
			else if (RUNTIME_CALLBACKS.has(method)) guards.push({ kind: 'runtime-callback', via: method });
		} else if (node.type === 'CallExpression' && child.listKey === 'arguments' && node.callee.type === 'Identifier' && RUNTIME_CALLBACKS.has(node.callee.name)) {
			guards.push({ kind: 'runtime-callback', via: node.callee.name });
		} else if (node.type === 'BlockStatement' && child.listKey === 'body') {
			// Early return before the call: `if (cond) return;`
			for (const sibling of node.body.slice(0, child.key)) {
				if (sibling.type !== 'IfStatement') continue;
				const c = sibling.consequent;
				const returns = c.type === 'ReturnStatement' || (c.type === 'BlockStatement' && c.body.length === 1 && c.body[0].type === 'ReturnStatement');
				if (returns) guards.push({ kind: 'early-return', test: shorten(sourceText(code, sibling.test)) });
			}
		}
		if (['FunctionDeclaration', 'FunctionExpression', 'ArrowFunctionExpression'].includes(node.type)) {
			if (node.async) guards.push({ kind: 'async' });
			if (node.type === 'FunctionDeclaration' && node.id && thenReferenced.has(node.id.name)) guards.push({ kind: 'async' });
		}
		child = parent;
		parent = parent.parentPath;
	}
	return guards;
}

function scanFile(file, zimletDir) {
	const code = fs.readFileSync(file, 'utf8');
	const ast = parse(code, {
		sourceType: 'module',
		plugins: ['jsx', 'decorators-legacy', 'classProperties', 'optionalChaining', 'nullishCoalescingOperator'],
		errorRecovery: true
	});
	const rel = path.relative(zimletDir, file).split(path.sep).join('/');
	const registrations = [];
	const redux = new Set();
	const thenReferenced = new Set();
	let factory;
	let hasDestroy = false;

	traverse(ast, {
		CallExpression(p) {
			const { callee } = p.node;
			if (callee.type === 'MemberExpression' && PROMISE_METHODS.has(callee.property.name)) {
				for (const arg of p.node.arguments) if (arg.type === 'Identifier') thenReferenced.add(arg.name);
			}
		}
	});

	traverse(ast, {
		CallExpression(p) {
			const { callee, arguments: args } = p.node;
			if (callee.type !== 'MemberExpression' || callee.computed) return;
			const method = callee.property.name;
			if (REDUX_METHODS.has(method)) redux.add(method);
			if (!REGISTER_METHODS.has(method) || !isPluginsObject(callee.object)) return;
			const key = keyText(code, args[0]);
			const handler = handlerInfo(args[1]);
			const reg = { op: method, key, ...handler, file: rel };
			if (key === 'settings' && method === 'register') {
				const settings = settingsInfo(code, args[1]);
				if (settings) reg.settings = settings;
			}
			reg.guards = collectGuards(code, p, thenReferenced);
			registrations.push(reg);
		},
		AssignmentExpression(p) {
			const { left } = p.node;
			if (left.type === 'MemberExpression' && !left.computed && left.object.name === 'exports') {
				if (left.property.name === 'init') factory = 'init-property';
				if (left.property.name === 'destroy') hasDestroy = true;
			}
		},
		ReturnStatement(p) {
			const arg = p.node.argument;
			if (arg && arg.type === 'ObjectExpression' && p.getFunctionParent()?.parentPath?.isExportDefaultDeclaration()) {
				for (const prop of arg.properties) {
					const name = prop.key?.name;
					if (name === 'init') factory = factory ?? 'returned-object';
					if (name === 'destroy') hasDestroy = true;
				}
			}
		}
	});
	return { registrations, redux, factory, hasDestroy };
}

function patternFor(reg) {
	const { key } = reg;
	if (key === 'settings') return 'settings';
	if (key.startsWith('messageProcessors:')) return 'message-processor';
	if (key.startsWith('slot::')) {
		const name = key.slice('slot::'.length);
		if (name === 'routes' || /-tab-item$/.test(name) || /landing-page/.test(name)) return 'vertical-route';
		if (/^(?!settings-dropdown).*(setting|preferences)/.test(name)) return 'settings-companion-slot';
		return 'slot-ui';
	}
	return 'unclassified';
}

function scanZimlet(repo, zimletDir) {
	const indexFile = path.join(zimletDir, 'src/index.js');
	const regs = [];
	const redux = new Set();
	let factory;
	let hasDestroy = false;
	for (const file of listSourceFiles(path.join(zimletDir, 'src'))) {
		const result = scanFile(file, zimletDir);
		regs.push(...result.registrations);
		result.redux.forEach(r => redux.add(r));
		if (file === indexFile) {
			factory = result.factory;
			hasDestroy = result.hasDestroy;
		}
	}
	const registrations = regs.map(r => ({ ...r, pattern: patternFor(r) }));
	const registerCalls = registrations.filter(r => r.op === 'register');

	const modifiers = new Set();
	const kinds = r => r.guards.map(g => g.kind);
	if (registrations.some(r => kinds(r).some(k => ['if', 'early-return'].includes(k)))) modifiers.add('conditional-registration');
	if (registrations.some(r => kinds(r).includes('async'))) modifiers.add('async-registration');
	if (registrations.some(r => r.op === 'unregister' || kinds(r).includes('runtime-callback'))) modifiers.add('dynamic-registration');
	if (registrations.some(r => kinds(r).includes('loop'))) modifiers.add('loop-registration');
	const counts = new Map();
	registerCalls.forEach(r => counts.set(r.key, (counts.get(r.key) ?? 0) + 1));
	if ([...counts.values()].some(n => n > 1)) modifiers.add('multi-handler');
	if (redux.size) modifiers.add('redux-wiring');
	if (registerCalls.length === 0) modifiers.add('no-registration');
	if (factory) modifiers.add('factory-shape');

	return {
		name: path.basename(zimletDir),
		repo: repo.id,
		index: path.relative(path.dirname(OUTPUT), indexFile).split(path.sep).join('/'),
		status: 'scanned',
		factory: factory ?? 'unknown',
		destroy: hasDestroy,
		modifiers: [...modifiers],
		redux: [...redux].sort(),
		registrations
	};
}

function discover(repos) {
	const zimlets = [];
	const skipped = [];
	for (const repo of repos) {
		if (!fs.existsSync(repo.dir)) {
			skipped.push(`${repo.id}: directory not found (${repo.dir})`);
			continue;
		}
		for (const name of fs.readdirSync(repo.dir).sort()) {
			const dir = path.join(repo.dir, name);
			if (!fs.statSync(dir).isDirectory()) continue;
			if (!fs.existsSync(path.join(dir, 'src/index.js'))) {
				skipped.push(`${repo.id}/${name}: no src/index.js`);
				continue;
			}
			zimlets.push(scanZimlet(repo, dir));
		}
	}
	return { zimlets, skipped };
}

// Mechanical view of a zimlet used to detect drift in a reviewed entry.
function fingerprint(z) {
	return {
		registrations: z.registrations.map(r => `${r.op} ${r.key}`).sort(),
		modifiers: [...z.modifiers].sort()
	};
}

function diffLists(before, after) {
	const b = new Set(before);
	const a = new Set(after);
	return { added: after.filter(x => !b.has(x)), removed: before.filter(x => !a.has(x)) };
}

function flowShortLists(node) {
	YAML.visit(node, {
		Seq(_, seq) {
			if (seq.items.length && seq.items.every(i => YAML.isScalar(i) && typeof i.value === 'string' && i.value.length < 60)) seq.flow = true;
		}
	});
	return node;
}

function flowMap(node) {
	node.flow = true;
	return flowShortLists(node);
}

function patternUsages(patternId, zimlets) {
	const usages = [];
	for (const z of zimlets) {
		const all = (z.registrations ?? []).filter(r => r.pattern === patternId);
		const regs = all.filter(r => r.op === 'register');
		if (all.length) {
			const variants = [...new Set(regs.map(r => r.variant).filter(Boolean))];
			const usage = { zimlet: z.name };
			if (regs.length) usage.registers = [...new Set(regs.map(r => r.key))];
			// Unregistered keys and files other than src/index.js show registrations changed at runtime.
			const unregisters = [...new Set(all.filter(r => r.op === 'unregister').map(r => r.key))];
			if (unregisters.length) usage.unregisters = unregisters;
			if (variants.length) usage.variants = variants;
			const files = [...new Set(all.map(r => r.file).filter(f => f !== 'src/index.js'))];
			if (files.length) usage.files = files;
			usages.push(usage);
		} else if ((z.modifiers ?? []).includes(patternId)) {
			const usage = { zimlet: z.name };
			const variants = patternId === 'factory-shape' ? [FACTORY_VARIANTS[z.factory] ?? z.factory] : z.modifierVariants?.[patternId];
			if (variants?.length) usage.variants = variants;
			usages.push(usage);
		}
	}
	return usages;
}

function merge(doc, scanned, repos, report) {
	if (!doc.contents) doc.contents = doc.createNode({});
	if (!doc.has('version')) {
		doc.set('version', 1);
		doc.commentBefore = HEADER.split('\n').map(l => ` ${l}`).join('\n');
	}
	if (!doc.has('sources')) {
		doc.set(
			'sources',
			flowShortLists(
				doc.createNode({
					repos: repos.map(r => ({ id: r.id, dir: r.id === 'zm-cloudsuite-zimlets' ? 'packages' : 'zimlets' })),
					slotCatalog: '../../../zm-x-web/.agents/zimlet/context/zimlet-slots.yml',
					slotCatalogRole: 'Reference only for the host side. Slot names here are not validated against it.'
				})
			)
		);
	}
	if (!doc.has('patterns')) doc.set('patterns', doc.createNode([]));
	if (!doc.has('zimlets')) doc.set('zimlets', doc.createNode([]));

	const zimletsSeq = doc.get('zimlets', true);
	const existing = doc.toJS().zimlets ?? [];

	for (const fresh of scanned) {
		const idx = existing.findIndex(z => z.name === fresh.name && z.repo === fresh.repo);
		if (idx === -1) {
			zimletsSeq.items.push(flowShortLists(doc.createNode(fresh)));
			existing.push(fresh);
			report.added.push(fresh.name);
			continue;
		}
		const current = existing[idx];
		if (current.status === 'complete') {
			const before = fingerprint(current);
			const after = fingerprint(fresh);
			const regDiff = diffLists(before.registrations, after.registrations);
			const modDiff = diffLists(before.modifiers, after.modifiers);
			if (regDiff.added.length || regDiff.removed.length || modDiff.added.length || modDiff.removed.length) {
				report.drift.push({ zimlet: fresh.name, ...regDiff, modifiersAdded: modDiff.added, modifiersRemoved: modDiff.removed });
			} else report.untouched.push(fresh.name);
			continue;
		}
		zimletsSeq.items[idx] = flowShortLists(doc.createNode({ ...fresh, status: current.status ?? 'scanned' }));
		existing[idx] = { ...fresh, status: current.status ?? 'scanned' };
		report.refreshed.push(fresh.name);
	}

	for (const current of existing) {
		if (!scanned.some(f => f.name === current.name && f.repo === current.repo)) report.missing.push(`${current.repo}/${current.name}`);
	}

	// Patterns: create missing skeletons, refresh scanned, append-only for complete.
	const patternsSeq = doc.get('patterns', true);
	const patterns = doc.toJS().patterns ?? [];
	const usedIds = new Set();
	existing.forEach(z => {
		(z.registrations ?? []).forEach(r => usedIds.add(r.pattern));
		(z.modifiers ?? []).forEach(m => usedIds.add(m));
	});
	const order = id => {
		const i = PATTERN_SKELETONS.findIndex(p => p.id === id);
		return i === -1 ? PATTERN_SKELETONS.length : i;
	};
	for (const id of [...usedIds].sort((a, b) => order(a) - order(b))) {
		if (patterns.some(p => p.id === id)) continue;
		const skeleton = PATTERN_SKELETONS.find(p => p.id === id) ?? { id, kind: 'registration', name: id, api: '' };
		const entry = { ...skeleton, status: 'scanned', summary: '', usages: [] };
		patternsSeq.items.push(flowShortLists(doc.createNode(entry)));
		patterns.push(entry);
		report.patternsAdded.push(id);
	}
	patterns.forEach((pattern, i) => {
		const desired = patternUsages(pattern.id, existing);
		if (pattern.status === 'complete') {
			const known = new Set((pattern.usages ?? []).map(u => u.zimlet));
			const missingUsages = desired.filter(u => !known.has(u.zimlet));
			if (missingUsages.length) {
				const usagesNode = doc.getIn(['patterns', i, 'usages'], true);
				if (usagesNode) missingUsages.forEach(u => usagesNode.items.push(flowMap(doc.createNode(u))));
				report.usagesAppended.push(`${pattern.id}: ${missingUsages.map(u => u.zimlet).join(', ')}`);
			}
			const stale = [...known].filter(z => !desired.some(u => u.zimlet === z));
			if (stale.length) report.staleUsages.push(`${pattern.id}: ${stale.join(', ')}`);
		} else {
			doc.setIn(['patterns', i, 'usages'], doc.createNode(desired.map(u => flowMap(doc.createNode(u)))));
		}
	});
}

function main() {
	const args = parseArgs(process.argv.slice(2));
	if (args.output) OUTPUT = args.output;
	// --repo overrides the directory of a default repo with the same id, or adds a new one.
	const repos = [...DEFAULT_REPOS.map(r => args.repos.find(o => o.id === r.id) ?? r), ...args.repos.filter(o => !DEFAULT_REPOS.some(r => r.id === o.id))];
	const { zimlets, skipped } = discover(repos);
	const original = fs.existsSync(OUTPUT) ? fs.readFileSync(OUTPUT, 'utf8') : '';
	const doc = YAML.parseDocument(original);
	if (doc.errors.length) throw new Error(`Cannot parse ${OUTPUT}: ${doc.errors[0].message}`);

	const report = { added: [], refreshed: [], untouched: [], drift: [], missing: [], patternsAdded: [], usagesAppended: [], staleUsages: [] };
	merge(doc, zimlets, repos, report);
	const output = doc.toString({ lineWidth: 0 });
	const unclassified = zimlets.flatMap(z => z.registrations.filter(r => r.pattern === 'unclassified').map(r => `${z.name}: ${r.key}`));
	const changed = output !== original;

	if (!args.check && changed) {
		fs.mkdirSync(path.dirname(OUTPUT), { recursive: true });
		fs.writeFileSync(OUTPUT, output);
	}

	const line = (label, list) => list.length && console.log(`${label} (${list.length}): ${list.map(x => (typeof x === 'string' ? x : JSON.stringify(x))).join(', ')}`);
	console.log(`${args.check ? 'Check' : 'Scan'} of ${zimlets.length} zimlets${args.check ? ' (no files written)' : ''}`);
	line('added', report.added);
	line('refreshed', report.refreshed);
	console.log(`untouched complete: ${report.untouched.length}`);
	line('drift in complete entries (not modified)', report.drift);
	line('in YAML but not found on disk', report.missing);
	line('patterns added', report.patternsAdded);
	line('usages appended to complete patterns', report.usagesAppended);
	line('usages of complete patterns no longer found', report.staleUsages);
	line('unclassified registrations', unclassified);
	line('skipped folders', skipped);
	console.log(changed ? (args.check ? 'File would change.' : `Wrote ${path.relative(CLI_ROOT, OUTPUT)}`) : 'File is up to date.');

	const needsAttention = changed || report.drift.length || report.missing.length || report.staleUsages.length || unclassified.length;
	if (args.check && needsAttention) process.exit(1);
}

main();
