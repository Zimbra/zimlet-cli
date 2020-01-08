/** This file is an auto-generated shim, aliased in for "preact/hooks" in the webpack config.
*  When components import 'preact/hooks', we want to give them back the copy
*  Zimbra passed down when it called the factory provided to zimlet().
*/

/* eslint-disable camelcase, dot-notation */
import { warnOnMissingExport } from '../../';
const wrap = warnOnMissingExport.bind(null, global.shims['preact/hooks'], 'preact/hooks');

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

export default global.shims['preact/hooks'];
