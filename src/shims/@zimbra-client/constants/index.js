/** This file is an auto-generated shim, aliased in for "@zimbra-client/constants" in the webpack config.
*  When components import '@zimbra-client/constants', we want to give them back the copy
*  Zimbra passed down when it called the factory provided to zimlet().
*/

/* eslint-disable camelcase, dot-notation */
import { warnOnMissingExport } from '../../';
const wrap = warnOnMissingExport.bind(null, global.shims['@zimbra-client/constants'], '@zimbra-client/constants');

export const ATTENDEE_ROLE = wrap('ATTENDEE_ROLE');
export const PARTICIPATION_STATUS = wrap('PARTICIPATION_STATUS');

export default global.shims['@zimbra-client/constants'];
