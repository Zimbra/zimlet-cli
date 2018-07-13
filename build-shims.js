const fs = require('fs');
const mockery = require('mockery');
const shimmedModules = require('./src/shims/index.js').SHIMMED_MODULES;

mockery.enable({
	warnOnReplace: false,
	warnOnUnregistered: false
});

mockery.registerSubstitute('react', 'preact-compat');
mockery.registerSubstitute('react-dom', 'preact-compat');
mockery.registerSubstitute('react-dom/server', 'preact-compat');
mockery.registerMock('apollo-client', {}); //doesn't really matter
mockery.registerMock('redux', {}); //doesn't really matter

shimmedModules.forEach(shimModule => {

	// console.log('require.cache', require.cache);
	//turn snake case into camelCase, e.g. preact-router into preactRouter
	let shimName = shimModule.replace(/-([a-z])/g, ([,m]) => m.toUpperCase());

	fs.writeFileSync(`src/shims/${shimModule}.js`,
		`/** This file is an auto-generated shim, aliased in for "${shimModule}" in the webpack config.
*  When components import '${shimModule}', we want to give them back the copy
*  Zimbra passed down when it called the factory provided to zimlet().
*/
import { warnOnMissingExport } from '.';
const wrap = warnOnMissingExport.bind(null, global.shims.${shimName}, '${shimModule}');

${Object.keys(require(shimModule)).map(exportName =>
		`export const ${exportName} = wrap('${exportName}');`).join('\n')
}
export default global.shims.${shimName};
`
	);
});

console.log('Successfully Built Shim files');
