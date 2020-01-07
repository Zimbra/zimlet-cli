/** This file is an auto-generated shim, aliased in for "recompose" in the webpack config.
*  When components import 'recompose', we want to give them back the copy
*  Zimbra passed down when it called the factory provided to zimlet().
*/

/* eslint-disable camelcase, dot-notation */
import { warnOnMissingExport } from '../';
const wrap = warnOnMissingExport.bind(null, global.shims['recompose'], 'recompose');

export const mapProps = wrap('mapProps');
export const withProps = wrap('withProps');
export const withPropsOnChange = wrap('withPropsOnChange');
export const withHandlers = wrap('withHandlers');
export const defaultProps = wrap('defaultProps');
export const renameProp = wrap('renameProp');
export const renameProps = wrap('renameProps');
export const flattenProp = wrap('flattenProp');
export const withState = wrap('withState');
export const withStateHandlers = wrap('withStateHandlers');
export const withReducer = wrap('withReducer');
export const branch = wrap('branch');
export const renderComponent = wrap('renderComponent');
export const renderNothing = wrap('renderNothing');
export const shouldUpdate = wrap('shouldUpdate');
export const pure = wrap('pure');
export const onlyUpdateForKeys = wrap('onlyUpdateForKeys');
export const onlyUpdateForPropTypes = wrap('onlyUpdateForPropTypes');
export const withContext = wrap('withContext');
export const getContext = wrap('getContext');
export const lifecycle = wrap('lifecycle');
export const toClass = wrap('toClass');
export const toRenderProps = wrap('toRenderProps');
export const fromRenderProps = wrap('fromRenderProps');
export const setStatic = wrap('setStatic');
export const setPropTypes = wrap('setPropTypes');
export const setDisplayName = wrap('setDisplayName');
export const compose = wrap('compose');
export const getDisplayName = wrap('getDisplayName');
export const wrapDisplayName = wrap('wrapDisplayName');
export const shallowEqual = wrap('shallowEqual');
export const isClassComponent = wrap('isClassComponent');
export const createSink = wrap('createSink');
export const componentFromProp = wrap('componentFromProp');
export const nest = wrap('nest');
export const hoistStatics = wrap('hoistStatics');
export const componentFromStream = wrap('componentFromStream');
export const componentFromStreamWithConfig = wrap('componentFromStreamWithConfig');
export const mapPropsStream = wrap('mapPropsStream');
export const mapPropsStreamWithConfig = wrap('mapPropsStreamWithConfig');
export const createEventHandler = wrap('createEventHandler');
export const createEventHandlerWithConfig = wrap('createEventHandlerWithConfig');
export const setObservableConfig = wrap('setObservableConfig');

export default global.shims['recompose'];
