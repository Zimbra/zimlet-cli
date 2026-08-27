/** This file is an auto-generated shim, aliased in for "@zimbra-client/pwa-utils" in the webpack config.
 *  When components import '@zimbra-client/pwa-utils', we want to give them back the copy
 *  Zimbra passed down when it called the factory provided to zimlet().
 */

import { warnOnMissingExport } from '../../';
const wrap = warnOnMissingExport.bind(null, global.shims['@zimbra-client/pwa-utils'], '@zimbra-client/pwa-utils');

export const awaitInstallPrompt = wrap('awaitInstallPrompt');
export const isStandalone = wrap('isStandalone');

export default global.shims['@zimbra-client/pwa-utils'];
