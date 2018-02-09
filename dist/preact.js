"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
/** This file is a shim, aliased in for "preact" in the webpack config.
 *  When components import 'preact', we want to give them back the copy
 *  Zimbra passed down when it called the factory provided to zimlet().
 */

var _global$preact = global.preact,
    h = _global$preact.h,
    createElement = _global$preact.createElement,
    cloneElement = _global$preact.cloneElement,
    Component = _global$preact.Component;
exports.h = h;
exports.createElement = createElement;
exports.cloneElement = cloneElement;
exports.Component = Component;
exports.default = global.preact;
//# sourceMappingURL=preact.js.map