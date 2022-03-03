/** This file is an auto-generated shim, aliased in for "react-redux" in the webpack config.
*  When components import 'react-redux', we want to give them back the copy
*  Zimbra passed down when it called the factory provided to zimlet().
*/

/* eslint-disable camelcase, dot-notation */
import { warnOnMissingExport } from '../';
const wrap = warnOnMissingExport.bind(null, global.shims['react-redux'], 'react-redux');

export const Provider = wrap('Provider');
export const connectAdvanced = wrap('connectAdvanced');
export const ReactReduxContext = wrap('ReactReduxContext');
export const connect = wrap('connect');
export const useDispatch = wrap('useDispatch');
export const createDispatchHook = wrap('createDispatchHook');
export const useSelector = wrap('useSelector');
export const createSelectorHook = wrap('createSelectorHook');
export const useStore = wrap('useStore');
export const createStoreHook = wrap('createStoreHook');
export const shallowEqual = wrap('shallowEqual');
export const batch = wrap('batch');

export default global.shims['react-redux'];
