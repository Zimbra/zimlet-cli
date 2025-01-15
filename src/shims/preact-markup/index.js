/** This file is an auto-generated shim, aliased in for "preact-markup" in the webpack config.
*  When components import 'preact-markup', we want to give them back the copy
*  Zimbra passed down when it called the factory provided to zimlet().
*/

/* eslint-disable camelcase, dot-notation */
import { warnOnMissingExport } from '../';
const wrap = warnOnMissingExport.bind(null, global.shims['preact-markup'], 'preact-markup');

export const setReviver = wrap('setReviver');

export default global.shims['preact-markup'];
