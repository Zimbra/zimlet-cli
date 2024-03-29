/** This file is an auto-generated shim, aliased in for "@zimbra-client/enhancers" in the webpack config.
*  When components import '@zimbra-client/enhancers', we want to give them back the copy
*  Zimbra passed down when it called the factory provided to zimlet().
*/

/* eslint-disable camelcase, dot-notation */
import { warnOnMissingExport } from '../../';
const wrap = warnOnMissingExport.bind(null, global.shims['@zimbra-client/enhancers'], '@zimbra-client/enhancers');

export const withMediaQuery = wrap('withMediaQuery');
export const withTabManager = wrap('withTabManager');
export const withIntlWrapper = wrap('withIntlWrapper');
export const withZimletIntlWrapper = wrap('withZimletIntlWrapper');
export const clientConfiguration = wrap('clientConfiguration');
export const withTracking = wrap('withTracking');
export const withIntlConsumer = wrap('withIntlConsumer');

export default global.shims['@zimbra-client/enhancers'];
