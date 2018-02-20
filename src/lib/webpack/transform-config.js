import path from 'path';

const defaultConfig = './zimlet.config.js';

export default function transformConfig(env, config) {
	let transformerPath = path.resolve(env.cwd, env.config || defaultConfig);
	try {
		require.resolve(transformerPath);
	}
	catch (err) {
		if (env.config && env.config !== defaultConfig) {
			console.warn(`zimlet-cli config could not be loaded!\nFile ${env.config} not found.`);
		}
		return;
	}

	require('babel-register')({
		presets: [require.resolve('babel-preset-env')]
	});

	const m = require(transformerPath);
	const transformer = m && m.default || m;

	try {
		transformer(config, Object.assign({}, env));
	}
	catch (err) {
		console.error(`Error at ${transformerPath}: \n` + err);
	}
}
