import path from 'path';

export function crossPlatformPathRegex(regexp) {
	if (path.sep==='\\') {
		regexp = new RegExp(regexp.source.replace(/(^|[^\\])\\\//g, '$1\\\\'), regexp.flags);
	}
	return regexp;
}
