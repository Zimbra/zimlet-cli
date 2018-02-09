'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.default = ZimletStyleLoader;

var _loaderUtils = require('loader-utils');

var _loaderUtils2 = _interopRequireDefault(_loaderUtils);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/** zimlet-style-loader is a replacement for style-loader.
 *  Instead of injecting CSS stylesheets into the a style tag in the document,
 *  this loader injects them into a global array called `ZIMLET_STYLES`.
 *  That array of string stylesheets is automatically passed to `styles.add()` by zimlet-cli's entrypoint.
*/

function ZimletStyleLoader() {}

ZimletStyleLoader.pitch = function (request) {
	if (this.cacheable) this.cacheable();
	var stringified = _loaderUtils2.default.stringifyRequest(this, '!!' + request);

	// Add the styles to global.ZIMLET_STYLES and then return the generated classnames.
	return '\n\t\tvar styles = require(' + stringified + ');\n\t\tZIMLET_STYLES.push(styles);\n\t\tmodule.exports = styles.locals;\n\t';
};
module.exports = exports['default'];
//# sourceMappingURL=zimlet-style-loader.js.map