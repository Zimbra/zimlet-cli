import { coreJsConfig, customConfig } from '@zimbra/eslint-config';

const finalConfig = [
	...customConfig,
	...coreJsConfig.map(conf => {
		return {
			...conf,
			ignores: [...conf.ignores, 'src/shims/**'],
			rules: {
				...conf.rules,
				'no-console': 'off'
			}
		};
	})
];

export default finalConfig;
