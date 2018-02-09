'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.crossPlatformPathRegex = crossPlatformPathRegex;

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function crossPlatformPathRegex(regexp) {
	if (_path2.default.sep === '\\') {
		regexp = new RegExp(regexp.source.replace(/(^|[^\\])\\\//g, '$1\\\\'), regexp.flags);
	}
	return regexp;
}
//# sourceMappingURL=util.js.map