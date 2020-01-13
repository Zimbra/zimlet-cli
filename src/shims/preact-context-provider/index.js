/** This file is an auto-generated shim, aliased in for "preact-context-provider" in the webpack config.
*  When components import 'preact-context-provider', we want to give them back the copy
*  Zimbra passed down when it called the factory provided to zimlet().
*/

/* eslint-disable camelcase, dot-notation */
import { warnOnMissingExport } from '../';
const wrap = warnOnMissingExport.bind(null, global.shims['preact-context-provider'], 'preact-context-provider');

export const MergingProvider = wrap('MergingProvider');
export default wrap('default');
export const mergingProvide = wrap('mergingProvide');
export const provide = wrap('provide');

