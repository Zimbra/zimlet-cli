/** This file is an auto-generated shim, aliased in for "preact/compat" in the webpack config.
*  When components import 'preact/compat', we want to give them back the copy
*  Zimbra passed down when it called the factory provided to zimlet().
*/

/* eslint-disable camelcase, dot-notation */
import { warnOnMissingExport } from '../../';
const wrap = warnOnMissingExport.bind(null, global.shims['preact/compat'], 'preact/compat');

export const useState = wrap('useState');
export const useReducer = wrap('useReducer');
export const useEffect = wrap('useEffect');
export const useLayoutEffect = wrap('useLayoutEffect');
export const useRef = wrap('useRef');
export const useImperativeHandle = wrap('useImperativeHandle');
export const useMemo = wrap('useMemo');
export const useCallback = wrap('useCallback');
export const useContext = wrap('useContext');
export const useDebugValue = wrap('useDebugValue');
export const useErrorBoundary = wrap('useErrorBoundary');
export const createElement = wrap('createElement');
export const createContext = wrap('createContext');
export const createRef = wrap('createRef');
export const Fragment = wrap('Fragment');
export const Component = wrap('Component');
export const version = wrap('version');
export const Children = wrap('Children');
export const render = wrap('render');
export const hydrate = wrap('hydrate');
export const unmountComponentAtNode = wrap('unmountComponentAtNode');
export const createPortal = wrap('createPortal');
export const createFactory = wrap('createFactory');
export const cloneElement = wrap('cloneElement');
export const isValidElement = wrap('isValidElement');
export const findDOMNode = wrap('findDOMNode');
export const PureComponent = wrap('PureComponent');
export const memo = wrap('memo');
export const forwardRef = wrap('forwardRef');
export const unstable_batchedUpdates = wrap('unstable_batchedUpdates');
export const StrictMode = wrap('StrictMode');
export const Suspense = wrap('Suspense');
export const SuspenseList = wrap('SuspenseList');
export const lazy = wrap('lazy');
export const __SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED = wrap('__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED');
export default wrap('default');

