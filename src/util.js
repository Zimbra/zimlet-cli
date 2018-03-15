import chalk from 'chalk';
import { statSync, existsSync } from 'fs';
import logSymbols from 'log-symbols';
import which from 'which';
import path, { normalize } from 'path';

export function crossPlatformPathRegex(regexp) {
	if (path.sep==='\\') {
		regexp = new RegExp(regexp.source.replace(/(^|[^\\])\\\//g, '$1\\\\'), regexp.flags);
	}
	return regexp;
}

export function isDir(str) {
	return existsSync(str) && statSync(str).isDirectory();
}

export function hasCommand(str) {
	return !!which.sync(str, { nothrow: true });
}

export function trim(str) {
	return str.trim().replace(/^\t+/gm, '');
}

export function success(text, code) {
	process.stderr.write(logSymbols.success + ' ' + text + '\n');
	code && process.exit(code);
}

export function info(text, code) {
	process.stderr.write(logSymbols.info + chalk.blue(' INFO ') + text + '\n');
	code && process.exit(code);
}

export function warn(text, code) {
	process.stdout.write(logSymbols.warning + chalk.yellow(' WARN ') + text + '\n');
	code && process.exit(code);
}

export function error(text, code) {
	process.stderr.write(logSymbols.error + chalk.red(' ERROR ') + text + '\n');
	code && process.exit(code);
}

export function normalizePath(path) {
	return normalize(path).replace(/\\/g, '/');
}
