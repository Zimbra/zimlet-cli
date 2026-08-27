import path from 'node:path';
import fs from 'node:fs';
import { createRequire } from 'node:module';
import { pathToFileURL } from 'node:url';

const defaultConfig = './zimlet.config.js';

export default function transformConfig(env, config) {
	let transformerPath = path.resolve(env.cwd, env.config || defaultConfig);

	if (!fs.existsSync(transformerPath)) {
		if (env.config && env.config !== defaultConfig) {
			console.warn(`zimlet-cli config could not be loaded!\nFile ${env.config} not found.`);
		}
		return;
	}

	const contextUrl = typeof import.meta !== 'undefined' && import.meta.url
		? import.meta.url
		: pathToFileURL(__filename).href;

	const requireSync = createRequire(contextUrl);

	try {
		const resolvedPath = requireSync.resolve(transformerPath);
		if (requireSync.cache[resolvedPath]) {
			delete requireSync.cache[resolvedPath];
		}
		
		const m = requireSync(transformerPath);
		const transformer = (m && m.default) || m;

		if (typeof transformer === 'function') {
			transformer(config, Object.assign({}, env));
		}
	} catch (err) {
		console.error(`Error executing transformer at ${transformerPath}: \n` + err);
	}
}
