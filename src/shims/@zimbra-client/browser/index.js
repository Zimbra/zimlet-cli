/** This file is an auto-generated shim, aliased in for "@zimbra-client/browser" in the webpack config.
*  When components import '@zimbra-client/browser', we want to give them back the copy
*  Zimbra passed down when it called the factory provided to zimlet().
*/

/* eslint-disable camelcase, dot-notation */
import { warnOnMissingExport } from '../../';
const wrap = warnOnMissingExport.bind(null, global.shims['@zimbra-client/browser'], '@zimbra-client/browser');

export const openExternalBrowser = wrap('openExternalBrowser');

export default global.shims['@zimbra-client/browser'];
