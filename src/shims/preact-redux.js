/** This file is an auto-generated shim, aliased in for "preact-redux" in the webpack config.
*  When components import 'preact-redux', we want to give them back the copy
*  Zimbra passed down when it called the factory provided to zimlet().
*/

/* eslint-disable camelcase */
import { warnOnMissingExport } from '.';
const wrap = warnOnMissingExport.bind(null, global.shims.preactRedux, 'preact-redux');

export const Provider = wrap('Provider');
export const connect = wrap('connect');
export const connectAdvanced = wrap('connectAdvanced');
export default global.shims.preactRedux;
