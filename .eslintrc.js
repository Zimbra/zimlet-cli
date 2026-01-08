module.exports = {
	parser: '@babel/eslint-parser',
	extends: [
		'eslint-config-synacor'
	],
	globals: {
		getZimlet: true
	},
	rules: {
		indent: ['error', 'tab', {
			ignoredNodes: ['TemplateLiteral'],
			SwitchCase: 1
		}]
	}
};
