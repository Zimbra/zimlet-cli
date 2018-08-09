/** This file is an auto-generated shim, aliased in for "@zimbra/util/redux" in the webpack config.
*  When components import '@zimbra/util/redux', we want to give them back the copy
*  Zimbra passed down when it called the factory provided to zimlet().
*/

/* eslint-disable camelcase, dot-notation */
import { warnOnMissingExport } from '../../../';
const wrap = warnOnMissingExport.bind(null, global.shims['@zimbra/util/redux'], '@zimbra/util/redux');

export const paginate = wrap('paginate');
export const createAsyncAction = wrap('createAsyncAction');
export const pendingAction = wrap('pendingAction');
export const fulfilledAction = wrap('fulfilledAction');
export const rejectedAction = wrap('rejectedAction');
export default global.shims['@zimbra/util/redux'];
