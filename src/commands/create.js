import ora from 'ora';
import gittar from 'gittar';
import { green } from 'chalk';
import fs from 'fs';
import { prompt } from 'inquirer';
import { resolve, dirname } from 'path';
import isValidName from 'validate-npm-package-name';
import { info, isDir, hasCommand, error, trim, warn } from '../util';
import { install, initGit, addScripts } from './../lib/setup';
import asyncCommand from '../lib/async-command';

// This command borrows heavily from preact-cli's create command
// https://github.com/developit/preact-cli

const ORG = 'zimbra';

//repo we want as an alias for 'default'?
const DEFAULT_REPO = 'zimbra/zm-x-zimlet-template-default';

const RGX = /\.(woff2?|ttf|eot|jpe?g|ico|png|gif|mp4|mov|ogg|webm)(\?.*)?$/i;
const isMedia = str => RGX.test(str);
const capitalize = str => str.charAt(0).toUpperCase() + str.substring(1);

const templateDesc = 'Remote template to clone (user/repo#tag)',
	destDesc = 'Directory to create the zimlet',
	nameDesc = 'The zimlet\'s name',
	forceDesc = 'Force `dest` directory to created if it already exists; will overwrite!',
	installDesc = 'Install dependencies',
	yarnDesc = 'Install with `yarn` instead of `npm`',
	gitDesc = 'Initialize a `git` repository';

export default asyncCommand({
	command: 'create [template] [dest]',

	desc: 'Create a new zimlet.',

	builder: {
		cwd: {
			description: 'A directory to use instead of $PWD.',
			default: '.',
			requiresArg: true
		},
		name: {
			description: nameDesc
		},
		force: {
			alias: 'f',
			description: forceDesc,
			type: 'boolean',
			default: false
		},
		yarn: {
			description: yarnDesc,
			type: 'boolean',
			default: false
		},
		git: {
			description: gitDesc,
			type: 'boolean',
			default: false
		},
		install: {
			alias: 'i',
			description: installDesc,
			type: 'boolean',
			default: true
		},
		template: {
			description: templateDesc
		},
		dest: {
			description: destDesc
		}
	},

	async handler(argv) {
		let destArg = argv.dest;
		let templateArg = argv.template;
		let nameArg = argv.name;

		// Prompt if incomplete data
		if (!destArg || !templateArg) {
			warn('Insufficient command arguments! Prompting...');
			info('Alternatively, run `zimlet create --help` for usage info.');

			let questions = isMissing(argv);
			let response = await prompt(questions);
			//trim all args to prevent accidental extra whitespace in user prompted values from messing things up
			Object.keys(response).forEach(k => response[k] && response[k].trim && (response[k] = response[k].trim()));
			Object.assign(argv, response);
		}

		//default is a special keyword that will use the predefiend default repo
		if (templateArg === 'default') templateArg = DEFAULT_REPO;

		let cwd = resolve(argv.cwd);
		destArg = destArg || dirname(cwd);
		let isYarn = argv.yarn && hasCommand('yarn');
		let target = resolve(cwd, destArg);
		let exists = isDir(target);

		if (exists && !argv.force) {
			return error('Refusing to overwrite current directory! Please specify a different destination or use the `--force` flag', 1);
		}

		if (exists && argv.force) {
			if (! await prompt({
				type: 'confirm',
				name: 'enableForce',
				message: `You are using '--force'. Do you wish to continue and overwrite ${target}?`,
				default: false
			})) {
				return error('Refusing to overwrite current directory!', 1);
			}
		}

		let repo = templateArg;
		if (!repo.includes('/')) {
			repo = `${ORG}/${repo}`;
			info(`Fetching ${templateArg} template from ${repo}...`);
		}

		// Use `--name` value or `dest` dir's name
		nameArg = nameArg || destArg;

		let { errors } = isValidName(nameArg);
		if (errors) {
			errors.unshift(`Invalid package name: ${nameArg}`);
			return error(errors.map(capitalize).join('\n  ~ '), 1);
		}

		// Attempt to fetch the `template`
		let archive = await gittar.fetch(repo).catch(err => {
			err = err || { message: 'An error occured while fetching template.' };
			return error(err.code === 404 ? `Could not find repository: ${repo}` : err.message, 1);
		});

		let spinner = ora({
			text: 'Creating project',
			color: 'magenta'
		}).start();

		// Extract files from `archive` to `target`
		// TODO: read & respond to meta/hooks
		let keeps=[];
		await gittar.extract(archive, target, {
			strip: 2,
			filter(path, obj) {
				if (path.includes('/template/')) {
					obj.on('end', () => {
						if (obj.type === 'File' && !isMedia(obj.path)) {
							keeps.push(obj.absolute);
						}
					});
					return true;
				}
			}
		});

		if (keeps.length) {
			let dict = new Map();

			// TODO: concat author-driven patterns
			//globally replace instances of {{name}} with value of name arg
			['name'].forEach(str => {
				// if value is defined
				if (argv[str] !== void 0) {
					dict.set(new RegExp(`{{\\s*${str}\\s*}}`, 'g'), argv[str]);
				}
			});

			// Update each file's contents
			let buf, entry, enc='utf8';
			for (entry of keeps) {
				buf = fs.readFileSync(entry, enc);
				dict.forEach((v, k) => {
					buf = buf.replace(k, v);
				});
				try {
					fs.writeFileSync(entry, buf, enc);
				}
				catch (err) {
					return error(`Couldn't write ${entry}: ${err}`);
				}

			}
		}
		else {
			return error(`No \`template\` directory found within ${ repo }!`, 1);
		}

		spinner.succeed().start('Parsing `package.json` file');

		// Validate user's `package.json` file
		let pkgData, pkgFile=resolve(target, 'package.json');

		if (pkgFile) {
			try {
				pkgData = JSON.parse(fs.readFileSync(pkgFile));
			}
			catch (err) {
				return error(`Could not reach package.json file: ${err}`);
			}
			// Write default "scripts" if none found
			pkgData.scripts = pkgData.scripts || (await addScripts(pkgData, target, isYarn));
		}
		else {
			warn('Could not locate `package.json` file!');
		}

		// Update `package.json` key
		if (pkgData) {
			spinner.succeed().start('Updating `name` to `' + nameArg + '` within `package.json` file');
			pkgData.name = nameArg.toLowerCase().replace(/\s+/g, '_');
		}

		if (pkgData) {
			// Assume changes were made
			try {
				fs.writeFileSync(pkgFile, JSON.stringify(pkgData, null, 2));
			}
			catch (err) {
				return error(`Unable to write back package.json file: ${err}`);
			}
		}

		if (argv.install) {
			spinner.succeed().start('Installing dependencies');
			await install(target, isYarn);
		}

		if (argv.git) {
			spinner.succeed().start('Initializing git repo');
			await initGit(target);
		}

		spinner.succeed().succeed('Done!\n');

		let pfx = isYarn ? 'yarn' : 'npm run';

		return trim(`
			To get started, cd into the new directory:
			  ${ green('cd ' + destArg) }

			To start a development live-reload server:
			  ${ green(pfx + ' watch') }

			To create a production build (in ./build):
			  ${ green(pfx + ' build') }

			To create the official zimlet package (in ./pkg)
			  ${ green(pfx + ' package') }
		`) + '\n';
	}
});

// Formulate Questions if `create` args are missing
function isMissing(argv) {
	let out = [];

	const ask = (name, message, val) => {
		let type = (typeof val === 'boolean') ? 'confirm' : 'input';
		out.push({ name, message, type, default: val });
	};

	// Required data
	!argv.template && ask('template', templateDesc, 'default');
	!argv.dest && ask('dest', destDesc);
	// Extra data / flags
	!argv.name && ask('name', nameDesc,({ dest }) => dest); //use the current answer for 'dest' as the default
	!argv.force && ask('force', forceDesc, false);
	ask('install', installDesc, true); // defaults `true`, ask anyway
	!argv.yarn && ask('yarn', yarnDesc, false);
	!argv.git && ask('git', gitDesc, false);

	return out;
}

