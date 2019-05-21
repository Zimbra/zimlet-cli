/** This file is an auto-generated shim, aliased in for "react-apollo" in the webpack config.
*  When components import 'react-apollo', we want to give them back the copy
*  Zimbra passed down when it called the factory provided to zimlet().
*/

/* eslint-disable camelcase, dot-notation */
import { warnOnMissingExport } from '../';
const wrap = warnOnMissingExport.bind(null, global.shims['react-apollo'], 'react-apollo');

export const renderToStringWithData = wrap('renderToStringWithData');
export const compose = wrap('compose');
export const getDataFromTree = wrap('getDataFromTree');
export const ApolloConsumer = wrap('ApolloConsumer');
export const ApolloProvider = wrap('ApolloProvider');
export const Query = wrap('Query');
export const Mutation = wrap('Mutation');
export const Subscription = wrap('Subscription');
export const graphql = wrap('graphql');
export const withQuery = wrap('withQuery');
export const withMutation = wrap('withMutation');
export const withSubscription = wrap('withSubscription');
export const withApollo = wrap('withApollo');
export const RenderPromises = wrap('RenderPromises');
export const getMarkupFromTree = wrap('getMarkupFromTree');
export const walkTree = wrap('walkTree');

export default global.shims['react-apollo'];
