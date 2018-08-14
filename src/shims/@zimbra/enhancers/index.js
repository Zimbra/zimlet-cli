/** This file is an auto-generated shim, aliased in for "@zimbra/enhancers" in the webpack config.
*  When components import '@zimbra/enhancers', we want to give them back the copy
*  Zimbra passed down when it called the factory provided to zimlet().
*/

/* eslint-disable camelcase, dot-notation */
import { warnOnMissingExport } from '../../';
const wrap = warnOnMissingExport.bind(null, global.shims['@zimbra/enhancers'], '@zimbra/enhancers');

export const withMediaQuery = wrap('withMediaQuery');
export default global.shims['@zimbra/enhancers'];
