module.exports = {
	parser: '@babel/eslint-parser',
	extends: [
		'eslint-config-synacor'
	],
	globals: {
		zimlet: true
	},
	rules: {
		indent: ['error', 'tab', {
			ignoredNodes: ['TemplateLiteral'],
			SwitchCase: 1
		}]
	}
};
