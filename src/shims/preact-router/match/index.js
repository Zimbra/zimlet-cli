/** This file is an auto-generated shim, aliased in for "preact-router/match" in the webpack config.
*  When components import 'preact-router/match', we want to give them back the copy
*  Zimbra passed down when it called the factory provided to zimlet().
*/

/* eslint-disable camelcase, dot-notation */
import { warnOnMissingExport } from '../../';
const wrap = warnOnMissingExport.bind(null, global.shims['preact-router/match'], 'preact-router/match');

export const Match = wrap('Match');
export default global.shims['preact-router/match'];
