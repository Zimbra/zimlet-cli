#!/usr/bin/env node

import '@babel/polyfill';
import yargs from 'yargs';
import create from './commands/create';
import packageCommand from './commands/package';
import run from './index';

const optionsForAllCommands = {
	config: {
		type: 'string',
		description: 'Path to a custom config file',
		default: './zimlet.config.js'
	}
};

yargs
	.command(create)
	.command('watch', 'Start a development server', {
		...optionsForAllCommands,
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
	},
	(argv) => {
		argv.watch = true;
		runCli(argv);
	})
	.command(['build'], 'Compile a zimlet', {
		...optionsForAllCommands,
		dest: {
			type: 'string',
			defaultDescription: './build',
			description: 'Directory for build artifacts'
		},
		publicpath: {
			type: 'string',
			defaultDescription: '/',
			description: 'Public path you would like to download resources from, e.g. "/@zimbra/service/zimlet/com_example_zimlet/"'
		}
	}, (argv ) => {
		argv.production = true;
		runCli(argv);
	})
	.command(packageCommand)
	.demandCommand(1, 'A command must be specified')
	.usage('Zimlet client tool for developing and building Zimlets.\n\nType "zimlet [commmand] --help" for command specific usage information')
	.help()
	.argv;

function runCli(argv) {
	run(argv, (err, result) => {
		if (err) process.stderr.write(err);
		else if (result) process.stdout.write(result);
		setTimeout( () => {
			process.exit(err ? 1 : 0);
		}, 10);
	});
}
