/** This file is an auto-generated shim, aliased in for "preact/jsx-runtime" in the webpack config.
*  When components import 'preact/jsx-runtime', we want to give them back the copy
*  Zimbra passed down when it called the factory provided to zimlet().
*/

/* eslint-disable camelcase, dot-notation */
import { warnOnMissingExport } from '../../';
const wrap = warnOnMissingExport.bind(null, global.shims['preact/jsx-runtime'], 'preact/jsx-runtime');

export const Fragment = wrap('Fragment');
export const jsx = wrap('jsx');
export const jsxs = wrap('jsxs');
export const jsxDEV = wrap('jsxDEV');

export default global.shims['preact/jsx-runtime'];
