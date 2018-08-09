/** This file is an auto-generated shim, aliased in for "@zimbra/util" in the webpack config.
*  When components import '@zimbra/util', we want to give them back the copy
*  Zimbra passed down when it called the factory provided to zimlet().
*/

/* eslint-disable camelcase, dot-notation */
import { warnOnMissingExport } from '../../';
const wrap = warnOnMissingExport.bind(null, global.shims['@zimbra/util'], '@zimbra/util');

export const array = wrap('array');
export const getDataTransferJSON = wrap('getDataTransferJSON');
export const setDataTransferJSON = wrap('setDataTransferJSON');
export default global.shims['@zimbra/util'];
