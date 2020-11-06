/** This file is an auto-generated shim, aliased in for "preact" in the webpack config.
*  When components import 'preact', we want to give them back the copy
*  Zimbra passed down when it called the factory provided to zimlet().
*/

/* eslint-disable camelcase, dot-notation */
import { warnOnMissingExport } from '../';
const wrap = warnOnMissingExport.bind(null, global.shims['preact'], 'preact');

export const render = wrap('render');
export const hydrate = wrap('hydrate');
export const createElement = wrap('createElement');
export const h = wrap('h');
export const Fragment = wrap('Fragment');
export const createRef = wrap('createRef');
export const isValidElement = wrap('isValidElement');
export const Component = wrap('Component');
export const cloneElement = wrap('cloneElement');
export const createContext = wrap('createContext');
export const toChildArray = wrap('toChildArray');
export const __u = wrap('__u');
export const options = wrap('options');

export default global.shims['preact'];
