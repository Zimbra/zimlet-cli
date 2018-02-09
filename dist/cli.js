#!/usr/bin/env node
'use strict';

var _yargs = require('yargs');

var _yargs2 = _interopRequireDefault(_yargs);

var _index = require('./index');

var _index2 = _interopRequireDefault(_index);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_yargs2.default.command('watch', 'Start a development server', {
	port: {
		type: 'number',
		description: 'Port of dev server',
		defaultDescription: 8081
	},
	https: {
		type: 'boolean',
		default: true,
		description: 'Protocol of dev server. https if true, http if false'
	}
}, function (argv) {
	argv.watch = true;
	runCli(argv);
}).command(['build'], 'Compile a zimlet', {
	dest: {
		type: 'string',
		defaultDescription: './build',
		description: 'Directory for build artifacts'
	}
}, function (argv) {
	argv.production = true;
	runCli(argv);
}).command(['package'], 'Package a zimlet for deployment', {
	name: {
		alias: 'n',
		type: 'string',
		description: 'Globally unique name for your zimlet, e.g. "com_mycompany_examplezimlet"',
		demandOption: true,
		requiresArg: true
	},
	'pkg-version': {
		alias: 'v',
		type: 'string',
		description: 'Version for your zimlet, e.g. "1.0.1"',
		demandOption: true,
		requiresArg: true
	},
	description: {
		alias: 'desc',
		type: 'string',
		description: 'Description for your zimlet',
		demandOption: true,
		requiresArg: true
	},
	builddir: {
		alias: 'b',
		type: 'string',
		defaultDescription: './build',
		description: 'Source directory of built artifacts to publish'
	},
	dest: {
		alias: 'd',
		type: 'string',
		defaultDescription: './pkg',
		description: 'Directory for packaged artifacts'
	}
}, function (argv) {
	argv.package = true;
	runCli(argv);
}).demandCommand(1, 'A command must be specified').usage('Zimlet client tool for developing and building Zimlets.\n\nType "zimlet [commmand] --help" for command specific usage information').help().argv;

function runCli(argv) {
	(0, _index2.default)(argv, function (err, result) {
		if (err) process.stderr.write(err);else if (result) process.stdout.write(result);
		setTimeout(function () {
			process.exit(err ? 1 : 0);
		}, 10);
	});
}
//# sourceMappingURL=cli.js.map