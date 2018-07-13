// KEEP THIS AS NON-ES-6 MODULE so build-shims.js can use it

exports.SHIMMED_MODULES = [
	'preact',
	'preact-router',
	'preact-compat',
	'preact-redux',
	'react-apollo'
];

/**
 * A shimmed module is injected into the global object by the parent app.
 * The shimmed module is then aliased as the real module, and Zimlet consumers
 * will not need to duplicate libraries used by the main app.
 */

exports.getShimPath =  function(module) {
	return require.resolve(`./${module}`);
};

/**
 * Modify the shimmed module function to throw a meaningful error message
 * in the event that a method we think should be provided by the module is not actually
 * available and is attempted to be used
 * @param {String} moduleName The name of the module to be used in the error log
 * @param {Object} e the `exports` object from a module
 */
exports.warnOnMissingExport = function(m, moduleName, namedExport) {
	return typeof m[namedExport] !== 'undefined' ?
		m[namedExport] :
		function() {
			throw new Error(`[ZimletCli]: Export ${moduleName}.${namedExport} was not found in the ${moduleName} instance passed down from ZimbraX.`);
		};
};
