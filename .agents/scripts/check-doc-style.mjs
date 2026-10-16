#!/usr/bin/env node
/**
 * Checks the mechanical style rules of .agents/rules/write-doc.md, .agents/rules/doc-guide/accessibility.md and style.md (sections 2, 6 and 9)
 * on AsciiDoc pages. It reports; it does not edit.
 *
 * Usage: node .agents/scripts/check-doc-style.mjs <page.adoc> [more pages ...]
 *        node .agents/scripts/check-doc-style.mjs --all
 *
 * Exit code 0 when nothing is found, 1 when something is found, 2 on a usage error.
 * It cannot judge whether the outcome comes first or whether a sentence is clear.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const PAGES = path.join(ROOT, 'documentation/modules/ROOT/pages');
const MAX_WORDS = 25;

const PAGE_TALK =
	/\b(this (page|section|guide|document|table)|in this example|the (table|list|diagram|figure|example) (below|above|lists|shows|gives)|each row|the guide (links|shows|explains|covers|does|teaches))\b/i;
const INTERNAL = /\b(zm-[a-z][a-z-]+|zimlet-patterns|zimlet-examples|zimlet-manager|\.agents)\b|\bsrc\/lib\//;
const ADMONITION = /^(NOTE|TIP|WARNING|CAUTION|IMPORTANT):|^\[(NOTE|TIP|WARNING|CAUTION|IMPORTANT)\]$/;
const BAD_LINK_TEXT = /^(here|this page|this link|click here|link|read more|more)$/i;

function plain(line) {
	return line
		.replace(/^\|\s*/, '')
		.replace(/^[*.]+\s+/, '')
		.replace(/(?:xref:|https?:\/\/)[^\s[]*\[([^\]]*)\]/g, '$1')
		.replace(/`[^`]*`/g, 'code')
		.replace(/\s+/g, ' ')
		.trim();
}

function check(file) {
	const findings = [];
	const add = (n, rule, text) => findings.push(`${path.relative(ROOT, file)}:${n}: ${rule}: ${text}`);
	const lines = fs.readFileSync(file, 'utf8').split('\n');
	let inCode = false;
	let inTable = false;
	let sectionAdmonitions = 0;
	let lastLevel = 0;
	let sawTitle = false;

	lines.forEach((raw, idx) => {
		const n = idx + 1;
		const line = raw.trimEnd();
		const prev = lines[idx - 1] ?? '';

		if (/^-{4,}$/.test(line) || /^\.{4,}$/.test(line)) {
			if (!inCode && !/^\[(source|listing)/.test(prev) && /^-{4,}$/.test(line)) {
				add(n, 'code block without language', 'start the block with [source,<language>]');
			}
			inCode = !inCode;
			return;
		}
		if (inCode) return;
		if (line.startsWith('|===')) {
			const first = lines[idx + 1] ?? '';
			const implicitHeader = first.trim() !== '' && (lines[idx + 2] ?? '').trim() === '';
			if (!inTable && !implicitHeader && !/(options|opts|%)[^\]]*header/.test(prev)) {
				add(n, 'table without header row', 'add options="header" above the table');
			}
			inTable = !inTable;
			return;
		}
		if (!line || line.startsWith('//') || /^(include|image)::/.test(line) || line.startsWith(':')) {
			const alt = /^image::[^[]*\[(.*)\]$/.exec(line);
			if (alt && !/^"[^"]+"$/.test(alt[1]) && alt[1].includes(',')) {
				add(n, 'image alt text', 'quote alt text that contains a comma');
			}
			return;
		}

		const heading = /^(=+)\s+(.*)$/.exec(line);
		if (heading) {
			const level = heading[1].length;
			if (level === 1) sawTitle = true;
			if (level > lastLevel + 1 && lastLevel !== 0) add(n, 'heading level', `skips from ${lastLevel} to ${level}`);
			if (level === 1 && idx > 0 && lines.slice(0, idx).some(l => /^=\s/.test(l))) {
				add(n, 'heading level', 'a page has one = title');
			}
			lastLevel = level;
			sectionAdmonitions = 0;
			return;
		}
		if (line.startsWith('[') && !ADMONITION.test(line)) {
			return;
		}
		if (ADMONITION.test(line)) {
			sectionAdmonitions += 1;
			if (sectionAdmonitions > 1) add(n, 'admonitions', 'more than one in a section');
		}

		for (const m of line.matchAll(/(?:xref:|https?:\/\/)[^\s[]*\[([^\]]*)\]/g)) {
			if (BAD_LINK_TEXT.test(m[1]) || /^https?:\/\//.test(m[1])) {
				add(n, 'link text', `"${m[1]}" does not say where the link goes`);
			}
		}
		if (PAGE_TALK.test(line)) add(n, 'talks about the page', line.match(PAGE_TALK)[0]);
		if (INTERNAL.test(line)) add(n, 'internal name', line.match(INTERNAL)[0]);

		if (/\u00AD|&shy;|&#173;|\w-$/.test(line)) add(n, 'word break', 'do not break a word with a hyphen at the end of a line or a soft hyphen');

		const text = plain(line);
		for (const sentence of text.split(/(?<=[.!?])\s+/)) {
			const words = sentence.split(/\s+/).filter(Boolean).length;
			if (words > MAX_WORDS) add(n, `sentence of ${words} words`, `${sentence.slice(0, 70)}...`);
		}
	});

	if (!sawTitle) add(1, 'title', 'the page does not start with = Title');
	return findings;
}

const args = process.argv.slice(2);
let files = args;
if (args[0] === '--all') {
	files = fs.readdirSync(PAGES).filter(f => f.endsWith('.adoc')).map(f => path.join(PAGES, f));
}
if (!files.length) {
	console.error('Usage: check-doc-style.mjs <page.adoc> [...] | --all');
	process.exit(2);
}
const all = files.flatMap(check);
console.log(all.length ? all.join('\n') : 'No findings.');
process.exit(all.length ? 1 : 0);
