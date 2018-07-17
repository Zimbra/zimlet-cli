import fs from 'fs';
import path from 'path';
import Zip from 'adm-zip';
import { error } from '../util';
import asyncCommand from '../lib/async-command';

export default asyncCommand({
	command: 'package',

	desc: 'Package a zimlet for deployment',

	builder: {
		name: {
			alias: 'n',
			description: 'Globally unique name for your zimlet, e.g. "com_mycompany_examplezimlet"',
			demandOption: true,
			requiresArg: true
		},
		//TODO: change to get this from package.json for the zimlet
		'pkg-version': {
			alias: 'v',
			description: 'Version for your zimlet, e.g. "1.0.1"',
			demandOption: true,
			requiresArg: true
		},
		description: {
			alias: 'desc',
			description: 'Description for your zimlet',
			demandOption: true,
			requiresArg: true
		},
		zimbraXVersion: {
			description: 'https://semver.org version range of Zimbra X that the Zimlet is compatible with.',
			default: '>=1.0.0',
			requiresArg: true
		},
		builddir: {
			alias: 'b',
			default: './build',
			description: 'Source directory of built artifacts to publish'
		},
		dest: {
			alias: 'd',
			defaultDescription: './pkg',
			description: 'Directory for packaged artifacts'
		}
	},


	async handler(argv) {

		// normalize built files source directory and desination package dir
		let cwd = process.cwd();
		let builddir = path.resolve(cwd, argv.builddir || 'build');
		let dest = path.resolve(cwd, argv.dest || 'pkg', `${argv.name}.zip`);

		//Create the xml descriptor file for the zimlet
		let xmlFile = `${argv.name}.xml`;

		let zimletXML = `<zimlet name="${argv.name}" version="${argv.pkgVersion}" description="${argv.description}" zimbraXZimletCompatibleSemVer="${argv.zimbraXVersion}">`;

		let files;
		try {
			files = fs.readdirSync(builddir);
		}
		catch (err) {
			return error(`Failed to read ${builddir}: ${err}`, 1);
		}

		files.forEach(file => {
			if (file.match(/\.js$/)) {
				zimletXML += `\n\t<include>${file}</include>`;
			}
			else if (file.match(/\.css$/)) {
				zimletXML += `\n\t<includeCSS>${file}</includeCSS>`;
			}
			else if (file !== xmlFile) {
				zimletXML += `\n\t<resource>${file}</resource>`;
			}
		});

		zimletXML += '\n</zimlet>';

		try {
			fs.writeFileSync(path.resolve(builddir, xmlFile), zimletXML);
		}
		catch (err) {
			return error(`Failed to write XML file: ${err}`, 1);
		}

		//Zip up the contents of the build dir along with the xml file as the final zimlet deliverable
		let zipFile = new Zip();
		zipFile.addLocalFolder(builddir, '');
		zipFile.writeZip(dest);

		return `Successfully packaged zimlet to: ${dest}\n`;
	}
});

