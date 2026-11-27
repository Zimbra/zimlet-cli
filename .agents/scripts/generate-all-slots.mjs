#!/usr/bin/env node
/**
 * Generates documentation/modules/ROOT/pages/reference/slots/all-slots.adoc (P34.8) from the
 * extension-point catalog (zm-x-web/.agents/zimlet/context/zimlet-slots.yml). The catalog gives each name
 * the page and anchor of its entry in its `doc` field, which zm-x-web/.agents/zimlet/scripts/find-slots.sh
 * sets from the slot pages. Run this again after the catalog or a slot page changes.
 *
 * The script only reads zm-x-web and writes nothing there.
 *
 * Usage: node .agents/scripts/generate-all-slots.mjs [--check]
 *
 * --check writes nothing and exits 1 when the page on disk differs from the generated one.
 * Exit code 1 also when a catalog name has no `doc` or its `doc` points to a page or anchor that does not exist,
 * 2 on a usage or input error.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const CATALOG = path.resolve(ROOT, '../zm-x-web/.agents/zimlet/context/zimlet-slots.yml');
const PAGES = path.join(ROOT, 'documentation/modules/ROOT/pages');
const SLOTS_DIR = path.join(PAGES, 'reference/slots');
const OUTPUT = path.join(SLOTS_DIR, 'all-slots.adoc');

const args = process.argv.slice(2);
const check = args.includes('--check');
if (args.some(a => a !== '--check')) {
	console.error('Usage: node .agents/scripts/generate-all-slots.mjs [--check]');
	process.exit(2);
}
if (!fs.existsSync(CATALOG)) {
	console.error('The catalog is missing: check out zm-x-web next to this repository.');
	process.exit(2);
}

function readCatalog() {
	const names = [];
	let current = null;
	for (const line of fs.readFileSync(CATALOG, 'utf8').split('\n')) {
		const kind = /^ {2}- kind: (\S+)/.exec(line);
		if (kind) {
			current = { kind: kind[1] };
			continue;
		}
		if (!current) continue;
		const name = /^ {4}name: (\S+)/.exec(line);
		if (name) {
			current.name = name[1];
			names.push(current);
			continue;
		}
		const doc = /^ {4}doc: (\S+)/.exec(line);
		if (doc) current.doc = doc[1];
	}
	return names;
}

function pageTitle(file) {
	const title = /^= (.+)$/m.exec(fs.readFileSync(file, 'utf8'));
	return title ? title[1].trim() : path.basename(file, '.adoc');
}

// Finds the entry that a `doc` value (`reference/slots/<page>.adoc#<anchor>`) points to: the title of the entry,
// and the place of its page in the guide. Returns null when the page or the anchor does not exist.
function resolveDoc(doc) {
	const [xrefPath, id] = doc.split('#');
	const file = path.join(PAGES, xrefPath);
	if (!id || !xrefPath.startsWith('reference/slots/') || !xrefPath.endsWith('.adoc') || !fs.existsSync(file)) {
		return null;
	}
	const lines = fs.readFileSync(file, 'utf8').split('\n');
	let title = null;
	lines.forEach((line, i) => {
		const heading = /^== (.+)$/.exec(line);
		if (heading && new RegExp(`^\\[#${id}(?:\\.[a-z-]+)?\\]$`).test(lines[i - 1] || '')) title = heading[1].trim();
		const term = /^\[\[([a-z0-9-]+)\]\]pass:\[<a class="anchor" href="#\1"><\/a>\]`([^`]+)`::$/.exec(line);
		if (term && term[1] === id && term[2] === id && !title) title = term[2];
	});
	if (!title) return null;
	const parts = xrefPath.slice('reference/slots/'.length).replace(/\.adoc$/, '').split('/');
	const group = pageTitle(path.join(SLOTS_DIR, `${parts[0]}.adoc`));
	const place = parts.length > 1 ? `${group}, ${pageTitle(file)}` : group;
	return { xrefPath, id, title, place };
}

const slug = name => name.replace(/[^a-zA-Z0-9]+/g, '-').replace(/^-|-$/g, '').toLowerCase();

const catalog = readCatalog();
const rows = [];
const undocumented = [];
const broken = [];
for (const { kind, name, doc } of catalog) {
	if (!doc) {
		undocumented.push(name);
		continue;
	}
	const entry = resolveDoc(doc);
	if (!entry) {
		broken.push(`${name} -> ${doc}`);
		continue;
	}
	rows.push({ name, pattern: entry.title === name ? null : entry.title, entry, isKey: kind === 'invoke-plugin' });
}
if (undocumented.length || broken.length) {
	if (undocumented.length) {
		console.error(
			`No doc for ${undocumented.length} name(s): document the name, then run find-slots.sh in zm-x-web:\n${undocumented.map(n => `  ${n}`).join('\n')}`
		);
	}
	if (broken.length) {
		console.error(
			`The doc of ${broken.length} name(s) points to a page or anchor that does not exist: run find-slots.sh in zm-x-web:\n${broken.map(n => `  ${n}`).join('\n')}`
		);
	}
	process.exit(1);
}

const ids = new Set();
for (const row of rows) {
	row.anchor = slug(row.name);
	if (ids.has(row.anchor)) {
		console.error(`Two names give the anchor "${row.anchor}": ${row.name}`);
		process.exit(1);
	}
	ids.add(row.anchor);
}

rows.sort((a, b) => a.name.toLowerCase().localeCompare(b.name.toLowerCase(), 'en'));
const letters = [...new Set(rows.map(r => r.name[0].toUpperCase()))];
const slotCount = rows.filter(r => !r.isKey).length;
const keyCount = rows.length - slotCount;

const out = [];
out.push('= All slots A to Z');
out.push('');
out.push(
	`Every extension point of the xref:reference/glossary.adoc#modern-ui[Modern UI] in one alphabetical list: ${slotCount} slots and ${keyCount} data keys, each with a link to its entry. Use it when you already know a name, such as one from a Zimlet you read or from the browser console. To browse by screen instead, start from xref:reference/slots.adoc[Slots and extension points].`
);
out.push('');
out.push(
	'You register a slot as `slot::<name>`, and the names here have no prefix. A data key has no prefix, so it appears as you register it. The names that repeat for each xref:reference/glossary.adoc#vertical[vertical] share one entry, such as `<vertical>-tab-item`. See xref:fundamentals/extending-the-ui.adoc[Slots and handlers] for how handlers work.'
);
for (const letter of letters) {
	out.push('');
	out.push(`[#names-starting-with-${letter.toLowerCase()}]`);
	out.push(`== Names starting with ${letter}`);
	out.push('');
	for (const row of rows.filter(r => r.name[0].toUpperCase() === letter)) {
		const target = `xref:${row.entry.xrefPath}#${row.entry.id}[\`${row.name}\`]`;
		const kind = row.isKey ? 'Data key' : 'Slot';
		const shared = row.pattern ? ` Documented once as \`${row.pattern}\`.` : '';
		out.push(`[[${row.anchor}]]pass:[<a class="anchor" href="#${row.anchor}"></a>]${target}::`);
		out.push(`${kind}. ${row.entry.place}.${shared}`);
		out.push('');
	}
	out.pop();
}
out.push('');
out.push('[#next-step]');
out.push('== Next step');
out.push('');
out.push(
	'Learn how a handler is registered and what it returns in xref:fundamentals/extending-the-ui.adoc[Slots and handlers].'
);
out.push('');

const text = out.join('\n');

const read = file => (fs.existsSync(file) ? fs.readFileSync(file, 'utf8') : '');
if (check) {
	if (read(OUTPUT) !== text) {
		console.error('all-slots.adoc is out of date: run node .agents/scripts/generate-all-slots.mjs');
		process.exit(1);
	}
	console.log('all-slots.adoc is up to date.');
} else {
	fs.writeFileSync(OUTPUT, text);
	console.log(`Wrote ${path.relative(ROOT, OUTPUT)}: ${rows.length} names (${slotCount} slots, ${keyCount} data keys).`);
}
