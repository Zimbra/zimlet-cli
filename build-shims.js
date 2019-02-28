const fs = require('fs');
const path = require('path');
const mkdirp = require('mkdirp');
const mockery = require('mockery');
const shimmedModules = require('./src/shims/index.js').SHIMMED_MODULES;

mockery.enable({
	warnOnReplace: false,
	warnOnUnregistered: false
});

mockery.registerSubstitute('react', 'preact-compat');
mockery.registerSubstitute('react-dom', 'preact-compat');
mockery.registerSubstitute('react-dom/server', 'preact-compat');
mockery.registerMock('preact-router/match', { Match: 1 });
mockery.registerMock('apollo-client', {}); //doesn't really matter
mockery.registerMock('redux', {}); //doesn't really matter

/* @zimbra/util is a psuedo-module: it is built from the many library
 * functions contained in `zm-x-web`.
 */
mockery.registerMock('@zimbra-client/util', {
	array: 1,
	getDataTransferJSON: 1,
	setDataTransferJSON: 1,
	breakpoints: 1,
	callWith: 1,
	pruneEmpty: 1
});

mockery.registerMock('@zimbra-client/util/contacts', {
	getName: 1
});

mockery.registerMock('@zimbra-client/util/redux', {
	paginate: 1,
	createAsyncAction: 1,
	pendingAction: 1,
	fulfilledAction: 1,
	rejectedAction: 1
});

mockery.registerMock('@zimbra-client/graphql', {
	CalendarsAndAppointmentsQuery: 1,
	withCreateAppointment: 1,
	withCalendars: 1,
	withSearch: 1,
	withCreateContact: 1,
	withContactAction: 1,
	CalendarCreateMutation: 1
});

mockery.registerMock('@zimbra-client/enhancers', {
	withMediaQuery: 1,
	registerTab: 1
});

mockery.registerMock('@zimbra-client/constants', {
	ATTENDEE_ROLE: 1,
	PARTICIPATION_STATUS: 1
});
mockery.registerMock('@zimbra-client/blocks', {
	Icon: 1,
	Button: 1,
	Spinner: 1,
	ModalDialog: 1
});
mockery.registerMock('@zimbra-client/errors', {
	errorMessage: 1
});

function createShim(shimModule) {
	if (Array.isArray(shimModule)) {
		shimModule.map((name, index) => !index ? name : `${shimModule[0]}/${name}`).forEach(createShim);
		return;
	}
	// console.log('require.cache', require.cache);
	//turn snake case into camelCase, e.g. preact-router into preactRouter
	let dirName = path.resolve(`src/shims/${shimModule}`);

	mkdirp(dirName, (err) => {
		if (err) { console.error(`Unable to mkdir ${dirName}`); return; }

		fs.writeFileSync(`${dirName}/index.js`,
			`/** This file is an auto-generated shim, aliased in for "${shimModule}" in the webpack config.
*  When components import '${shimModule}', we want to give them back the copy
*  Zimbra passed down when it called the factory provided to zimlet().
*/

/* eslint-disable camelcase, dot-notation */
import { warnOnMissingExport } from '.${shimModule.split('/').map((pathpart, index) => !index ? './' : '../').join('')}';
const wrap = warnOnMissingExport.bind(null, global.shims['${shimModule}'], '${shimModule}');

${Object.keys(require(shimModule)).map(exportName =>
		`export const ${exportName} = wrap('${exportName}');`).join('\n')
}
export default global.shims['${shimModule}'];
`
		);
	});
}

shimmedModules.forEach(createShim);

console.log('Successfully Built Shim files');
