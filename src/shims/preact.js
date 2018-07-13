/** This file is an auto-generated shim, aliased in for "preact" in the webpack config.
*  When components import 'preact', we want to give them back the copy
*  Zimbra passed down when it called the factory provided to zimlet().
*/
import { warnOnMissingExport } from '.';
const wrap = warnOnMissingExport.bind(null, global.shims.preact, 'preact');

export const h = wrap('h');
export const createElement = wrap('createElement');
export const cloneElement = wrap('cloneElement');
export const Component = wrap('Component');
export const render = wrap('render');
export const rerender = wrap('rerender');
export const options = wrap('options');
export default global.shims.preact;
