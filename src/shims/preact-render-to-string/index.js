/** This file is an auto-generated shim, aliased in for "preact-render-to-string" in the webpack config.
*  When components import 'preact-render-to-string', we want to give them back the copy
*  Zimbra passed down when it called the factory provided to zimlet().
*/

/* eslint-disable camelcase, dot-notation */
import { warnOnMissingExport } from '../';
const wrap = warnOnMissingExport.bind(null, global.shims['preact-render-to-string'], 'preact-render-to-string');

export const render = wrap('render');
export const shallowRender = wrap('shallowRender');

export default global.shims['preact-render-to-string'];
