/** This file is an auto-generated shim, aliased in for "@zimbra-client/errors" in the webpack config.
*  When components import '@zimbra-client/errors', we want to give them back the copy
*  Zimbra passed down when it called the factory provided to zimlet().
*/

/* eslint-disable camelcase, dot-notation */
import { warnOnMissingExport } from '../../';
const wrap = warnOnMissingExport.bind(null, global.shims['@zimbra-client/errors'], '@zimbra-client/errors');

export const errorMessage = wrap('errorMessage');
export const faultCode = wrap('faultCode');

export default global.shims['@zimbra-client/errors'];
