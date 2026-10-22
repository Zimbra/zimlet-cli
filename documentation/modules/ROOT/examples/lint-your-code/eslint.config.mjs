import {
	coreJsConfig,
	customConfig,
	reactConfig,
	prettierConfig,
	preactI18nConfig
} from '@zimbra/eslint-config';

export default [
	{ ignores: ['**/node_modules/**', '**/build/**', '**/pkg/**'] },
	coreJsConfig,
	customConfig,
	reactConfig,
	prettierConfig,
	preactI18nConfig,
	{
		rules: {
			// Only en_US ships, so the other languages would always be reported as missing
			'preact-i18n/no-unknown-key': 'off'
		}
	}
];
