/** This file is an auto-generated shim, aliased in for "clipboard-polyfill" in the webpack config.
*  When components import 'clipboard-polyfill', we want to give them back the copy
*  Zimbra passed down when it called the factory provided to zimlet().
*/

/* eslint-disable camelcase, dot-notation */
import { warnOnMissingExport } from '../';
const wrap = warnOnMissingExport.bind(null, global.shims['clipboard-polyfill'], 'clipboard-polyfill');

export const writeText = wrap('writeText');

export default global.shims['clipboard-polyfill'];
