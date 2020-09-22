import loaderUtils from 'loader-utils';

/** zimlet-style-loader is a replacement for style-loader.
 *  Instead of injecting CSS stylesheets into the a style tag in the document,
 *  this loader injects them into a global array called `ZIMLET_STYLES`.
 *  That array of string stylesheets is automatically passed to `styles.add()` by zimlet-cli's entrypoint.
*/

export default function ZimletStyleLoader() { }

ZimletStyleLoader.pitch = function(request) {
	if (this.cacheable) this.cacheable();
	const stringified = loaderUtils.stringifyRequest(this, '!!'+request);

	// Add the styles to global.ZIMLET_STYLES and then return the generated classnames.
	return `
		var styles = require(${stringified}).default;
		ZIMLET_STYLES.push(styles);
		module.exports = styles.locals;
	`;

};
