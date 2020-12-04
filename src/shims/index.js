// KEEP THIS AS NON-ES-6 MODULE so build-shims.js can use it

/**
 * A shimmed module is injected into the global object by the parent app.
 * The shimmed module is then aliased as the real module, and Zimlet consumers
 * will not need to duplicate libraries used by the main app.
 */

/**
 * @constant
 * For strings: each string will create an alias to `src/shims/${shim}/`
 *   and one shim file `src/shims/${shim}/index.js`
 * For arrays: the first string is the alias and the rest are paths,
 *   creating an alias to `src/shims/${shim}`; and shim files
 *   at `src/shims/${shim}/index.js` and `src/shims/${shim}/${path}/index.js`
 */
exports.SHIMMED_MODULES = [
	['preact', 'compat', 'hooks'],
	['preact-router', 'match'],
	['@apollo/client', 'react/hoc', 'react/components'],
	'react-redux',
	'recompose',
	'moment',
	'preact-context-provider',
	'preact-pwa-install',
	'preact-i18n',
	'clipboard-polyfill',
	'preact-render-to-string',
	['@zimbra-client/util', 'redux', 'contacts'], // Multiple shim files under one alias (@zimbra/util, @zimbra/util/redux, @zimbra/util/contacts)
	'@zimbra-client/blocks',
	'@zimbra-client/components',
	'@zimbra-client/browser',
	'@zimbra-client/errors',
	'@zimbra-client/graphql',
	'@zimbra-client/enhancers',
	'@zimbra-client/constants',
	['@zimbra-client/hooks', 'graphql']
];

exports.getShimPath = function(module) {
	return require.resolve(`./${module}`).replace(/index\.js$/, '');
};

/**
 * Modify the shimmed module function to throw a meaningful error message
 * in the event that a method we think should be provided by the module is not actually
 * available and is attempted to be used
 * @param {String} moduleName The name of the module to be used in the error log
 * @param {Object} e the `exports` object from a module
 */
exports.warnOnMissingExport = function(m, moduleName, namedExport) {
	return m && typeof m[namedExport] !== 'undefined'
		? m[namedExport]
		: function() {
			throw new Error(
				`[ZimletCli]: Export ${moduleName}.${namedExport} was not found in the ${moduleName} instance passed down from ZimbraX.`
			);
		  };
};
