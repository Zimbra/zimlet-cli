/** This file is an auto-generated shim, aliased in for "dompurify" in the webpack config.
*  When components import 'dompurify', we want to give them back the copy
*  Zimbra passed down when it called the factory provided to zimlet().
*/

/* eslint-disable camelcase, dot-notation */
import { warnOnMissingExport } from '../';
const wrap = warnOnMissingExport.bind(null, global.shims['dompurify'], 'dompurify');

export const version = wrap('version');
export const removed = wrap('removed');
export const isSupported = wrap('isSupported');

export default global.shims['dompurify'];
