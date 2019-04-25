/** This file is an auto-generated shim, aliased in for "preact-compat" in the webpack config.
*  When components import 'preact-compat', we want to give them back the copy
*  Zimbra passed down when it called the factory provided to zimlet().
*/

/* eslint-disable camelcase, dot-notation */
import { warnOnMissingExport } from '../';
const wrap = warnOnMissingExport.bind(null, global.shims['preact-compat'], 'preact-compat');

export const version = wrap('version');
export const DOM = wrap('DOM');
export const PropTypes = wrap('PropTypes');
export const Children = wrap('Children');
export const render = wrap('render');
export const hydrate = wrap('hydrate');
export const createClass = wrap('createClass');
export const createPortal = wrap('createPortal');
export const createFactory = wrap('createFactory');
export const createElement = wrap('createElement');
export const cloneElement = wrap('cloneElement');
export const createRef = wrap('createRef');
export const isValidElement = wrap('isValidElement');
export const findDOMNode = wrap('findDOMNode');
export const unmountComponentAtNode = wrap('unmountComponentAtNode');
export const Component = wrap('Component');
export const PureComponent = wrap('PureComponent');
export const unstable_renderSubtreeIntoContainer = wrap('unstable_renderSubtreeIntoContainer');
export const unstable_batchedUpdates = wrap('unstable_batchedUpdates');
export const __spread = wrap('__spread');
export default global.shims['preact-compat'];
