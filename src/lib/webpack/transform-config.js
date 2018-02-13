import path from 'path';

export default function transformConfig(env, config) {
	let transformerPath = path.resolve(env.cwd, env.config || './zimlet.config.js');
	try {
		require.resolve(transformerPath);
	}
	catch (err) {
		if (env.config) {
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
