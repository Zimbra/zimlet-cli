/** This file is an auto-generated shim, aliased in for "@zimbra-client/platform" in the webpack config.
*  When components import '@zimbra-client/platform', we want to give them back the copy
*  Zimbra passed down when it called the factory provided to zimlet().
*/

/* eslint-disable camelcase, dot-notation */
import { warnOnMissingExport } from '../../';
const wrap = warnOnMissingExport.bind(null, global.shims['@zimbra-client/platform'], '@zimbra-client/platform');

export const getPlatformType = wrap('getPlatformType');
export const PLATFORM_TYPES = wrap('PLATFORM_TYPES');

export default global.shims['@zimbra-client/platform'];
