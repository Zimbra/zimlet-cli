/** This file is an auto-generated shim, aliased in for "redux-actions" in the webpack config.
*  When components import 'redux-actions', we want to give them back the copy
*  Zimbra passed down when it called the factory provided to zimlet().
*/

/* eslint-disable camelcase, dot-notation */
import { warnOnMissingExport } from '../';
const wrap = warnOnMissingExport.bind(null, global.shims['redux-actions'], 'redux-actions');

export const combineActions = wrap('combineActions');
export const createAction = wrap('createAction');
export const createActions = wrap('createActions');
export const createCurriedAction = wrap('createCurriedAction');
export const handleAction = wrap('handleAction');
export const handleActions = wrap('handleActions');

export default global.shims['redux-actions'];
