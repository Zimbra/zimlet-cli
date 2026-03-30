import { coreJsConfig, customConfig } from '@zimbra/eslint-config';

// Ignore directory patterns
const globalIgnores = ['**/node_modules/**', 'build/**', 'dist/**', 'package-lock.json', 'package.json'];

// Helper function to merge a specific key from multiple configs
const mergeConfigKey = (configs, key) =>
	Object.assign({}, ...configs.map(config => config[key] || {}));

// Configs to merge for JavaScript files
const jsConfigs = [coreJsConfig, customConfig];

// Build JavaScript config dynamically
const finalConfig = {
	files: ['**/*.{js,mjs}'],
	ignores: ['src/shims/**'],

	languageOptions: coreJsConfig.languageOptions,

	plugins: mergeConfigKey(jsConfigs, 'plugins'),
	rules: mergeConfigKey(jsConfigs, 'rules'),
	settings: mergeConfigKey(jsConfigs, 'settings')
};

export default [
	{
		ignores: globalIgnores
	},
	finalConfig
];

