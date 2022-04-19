import fs from 'fs';
import path from 'path';
import Zip from 'adm-zip';
import { error, warn } from '../util';
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
			default: null
		},
		label: {
			alias: 'l',
			description: 'Display name for your zimlet',
			default: null
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

		// Get label and description from src/intl/en_US.json or from argument
		const { label, description } = getZimletLabelDescription() || argv;

		if (!(label && description)) {
			return error('label and description string are not provided as argument');
		}

		// Create the xml descriptor file for the zimlet
		let xmlFile = `${argv.name}.xml`;

		let zimletXML = `<zimlet name="${argv.name}" version="${argv.pkgVersion}" description="${description}" label="${label}" zimbraXZimletCompatibleSemVer="${argv.zimbraXVersion}">`;

		let files;
		try {
			files = fs.readdirSync(builddir);
		}
		catch (err) {
			return error(`Failed to read ${builddir}: ${err}`, 1);
		}

		files
			.filter(file => !file.match(/\.properties$/))
			.forEach(file => {
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

		createLocalizationFiles(argv.name, label, description);

		//Zip up the contents of the build dir along with the xml file as the final zimlet deliverable
		let zipFile = new Zip();
		zipFile.addLocalFolder(builddir, '');
		zipFile.writeZip(dest);

		return `Successfully packaged zimlet to: ${dest}\n`;
	}
});


function getZimletLabelDescription() {
	const intlDir = path.resolve(process.cwd(), 'src', 'intl');

	try {
		const content = JSON.parse(
			fs.readFileSync(path.resolve(intlDir, 'en_US.json'))
		);

		if (!(content.zimlet?.label && content.zimlet?.description)) {
			throw new Error('label or description not found');
		}
		return {
			label: content.zimlet.label,
			description: content.zimlet.description
		};
	}
	catch (err) {
		warn(`Failed to read src/intl/en_US.json file: ${err}. \nMake sure below content present in src/intl/en_US.json file \n
		"zimlet": {
			"label": "<zimlet label>",
			"description": "<zimlet description>"
		} \nAs a fallback we are using strings from package.json which is deprecated.\n`);
		return null;
	}

}

// Add properties file for description and label
// As admin console requires properties file to display label and desciption
function createLocalizationFiles(zimletName, label, description) {
	const cwd = process.cwd();
	const intlDir = path.resolve(cwd, 'src', 'intl');
	let intlFiles;

	createPropertyFile(zimletName, label, description);

	try {
		intlFiles = fs.readdirSync(intlDir);
	}
	catch (err) {
		console.error(`Failed to read ${intlDir}: ${err}`, 1);
	}

	intlFiles
		.filter(file => file.match(/\.json$/) && !file.includes('en_US'))
		.forEach(intl => {
			try {
				const content = JSON.parse(
					fs.readFileSync(path.resolve(intlDir, intl))
				);
				const propertiesFileName = `${zimletName}_${intl.replace(
					'.json',
					''
				)}`;
				const labelValue = getUnicode(content.zimlet?.label || '');
				const descriptionValue = getUnicode(content.zimlet?.description || '');

				createPropertyFile(propertiesFileName, labelValue, descriptionValue);
			}
			catch (ex) {
				error(`Error while reading file: ${ex}`, 1);
			}
		});
}

function createPropertyFile(fileName, label, description) {
	const builddir = path.resolve(process.cwd(), 'build');
	const propertiesFile = `${fileName}.properties`;
	let zimletProperties = '\n';
	zimletProperties += `label = ${label}\n`;
	zimletProperties += `description = ${description}\n`;

	try {
		fs.writeFileSync(path.resolve(builddir, propertiesFile), zimletProperties);
	}
	catch (err) {
		return error(`Failed to write properties file: ${err}`, 1);
	}
}

function getUnicode(txt) {
	let hex = '';
	if (txt.length === 0) return;
	for (let i = 0; i < txt.length; i++) {
		const h = txt.codePointAt(i).toString(16);
		hex += '\\u' + h.padStart(4, 0);
		if (h.length > 4) i++;
	}
	return hex;
}
