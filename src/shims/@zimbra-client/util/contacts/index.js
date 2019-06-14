/** This file is an auto-generated shim, aliased in for "@zimbra-client/util/contacts" in the webpack config.
*  When components import '@zimbra-client/util/contacts', we want to give them back the copy
*  Zimbra passed down when it called the factory provided to zimlet().
*/

/* eslint-disable camelcase, dot-notation */
import { warnOnMissingExport } from '../../../';
const wrap = warnOnMissingExport.bind(null, global.shims['@zimbra-client/util/contacts'], '@zimbra-client/util/contacts');

export const getName = wrap('getName');

export default global.shims['@zimbra-client/util/contacts'];
