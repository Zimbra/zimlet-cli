#!/usr/bin/env node
/**
 * Generates documentation/modules/ROOT/pages/reference/slots/all-slots.adoc (P34.8) from the
 * extension-point catalog (zm-x-web/.agents/zimlet/context/zimlet-slots.yml) and the slot pages
 * under pages/reference/slots/. Run it again after the catalog or a slot page changes.
 *
 * Usage: node .agents/scripts/generate-all-slots.mjs [--check]
 *
 * --check writes nothing and exits 1 when the page on disk differs from the generated one.
 * Exit code 1 also when a catalog name has no entry in a slot page, 2 on a usage or input error.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const CATALOG = path.resolve(ROOT, '../zm-x-web/.agents/zimlet/context/zimlet-slots.yml');
const PAGES = path.join(ROOT, 'documentation/modules/ROOT/pages');
const SLOTS_DIR = path.join(PAGES, 'reference/slots');
const OUTPUT = path.join(SLOTS_DIR, 'all-slots.adoc');
const PATTERN_SUFFIXES = ['tab-item', 'default-tab', 'landing-page', 'landing-page-description', 'landing-page-videos'];
const PATTERN_NAME = new RegExp(`^[a-z]+-(${PATTERN_SUFFIXES.join('|')})$`);

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
		const name = /^ {4}name: (\S+)/.exec(line);
		if (name && current) {
			current.name = name[1];
			names.push(current);
			current = null;
		}
	}
	return names;
}

function pageTitle(file) {
	const title = /^= (.+)$/m.exec(fs.readFileSync(file, 'utf8'));
	return title ? title[1].trim() : path.basename(file, '.adoc');
}

// Maps every entry heading of the slot pages, and every slot term of a page that lists slots as a description list
// (such as Hide built-in UI), to its page, anchor id and place in the guide.
function readEntries() {
	const entries = new Map();
	const files = [];
	(function walk(dir) {
		for (const item of fs.readdirSync(dir, { withFileTypes: true })) {
			const full = path.join(dir, item.name);
			if (item.isDirectory()) walk(full);
			else if (item.name.endsWith('.adoc') && full !== OUTPUT) files.push(full);
		}
	})(SLOTS_DIR);
	for (const file of files) {
		const relative = path.relative(SLOTS_DIR, file).replace(/\\/g, '/');
		const parts = relative.replace(/\.adoc$/, '').split('/');
		const group = pageTitle(path.join(SLOTS_DIR, `${parts[0]}.adoc`));
		const place = parts.length > 1 ? `${group}, ${pageTitle(file)}` : group;
		const xrefPath = `reference/slots/${relative}`;
		const lines = fs.readFileSync(file, 'utf8').split('\n');
		lines.forEach((line, i) => {
			const heading = /^== (.+)$/.exec(line);
			const id = /^\[#([a-z0-9-]+)(?:\.[a-z-]+)?\]$/.exec(lines[i - 1] || '');
			if (heading && id) entries.set(heading[1].trim(), { xrefPath, id: id[1], place });
			const term = /^\[\[([a-z0-9-]+)\]\]pass:\[<a class="anchor" href="#\1"><\/a>\]`([^`]+)`::$/.exec(line);
			if (term && term[1] === term[2] && !entries.has(term[2])) {
				entries.set(term[2], { xrefPath, id: term[1], place });
			}
		});
	}
	return entries;
}

const slug = name => name.replace(/[^a-zA-Z0-9]+/g, '-').replace(/^-|-$/g, '').toLowerCase();

const catalog = readCatalog();
const entries = readEntries();
const rows = [];
const missing = [];
for (const { kind, name } of catalog) {
	let entry = entries.get(name);
	let pattern = null;
	if (!entry && PATTERN_NAME.test(name)) {
		pattern = `<vertical>-${PATTERN_NAME.exec(name)[1]}`;
		entry = entries.get(pattern);
	}
	if (!entry) {
		missing.push(name);
		continue;
	}
	rows.push({ name, pattern, entry, isKey: kind === 'invoke-plugin' });
}
if (missing.length) {
	console.error(`No entry found for ${missing.length} name(s):\n${missing.map(n => `  ${n}`).join('\n')}`);
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
if (check) {
	const current = fs.existsSync(OUTPUT) ? fs.readFileSync(OUTPUT, 'utf8') : '';
	if (current !== text) {
		console.error('all-slots.adoc is out of date: run node .agents/scripts/generate-all-slots.mjs');
		process.exit(1);
	}
	console.log('all-slots.adoc is up to date.');
} else {
	fs.writeFileSync(OUTPUT, text);
	console.log(`Wrote ${path.relative(ROOT, OUTPUT)}: ${rows.length} names (${slotCount} slots, ${keyCount} data keys).`);
}
