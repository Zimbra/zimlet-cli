/** This file is an auto-generated shim, aliased in for "react-apollo" in the webpack config.
*  When components import 'react-apollo', we want to give them back the copy
*  Zimbra passed down when it called the factory provided to zimlet().
*/

/* eslint-disable camelcase, dot-notation */
import { warnOnMissingExport } from '../';
const wrap = warnOnMissingExport.bind(null, global.shims['react-apollo'], 'react-apollo');

export const ApolloConsumer = wrap('ApolloConsumer');
export const ApolloProvider = wrap('ApolloProvider');
export const getApolloContext = wrap('getApolloContext');
export const resetApolloContext = wrap('resetApolloContext');
export const Mutation = wrap('Mutation');
export const Query = wrap('Query');
export const Subscription = wrap('Subscription');
export const graphql = wrap('graphql');
export const withApollo = wrap('withApollo');
export const withMutation = wrap('withMutation');
export const withQuery = wrap('withQuery');
export const withSubscription = wrap('withSubscription');
export const useApolloClient = wrap('useApolloClient');
export const useLazyQuery = wrap('useLazyQuery');
export const useMutation = wrap('useMutation');
export const useQuery = wrap('useQuery');
export const useSubscription = wrap('useSubscription');
export const getDataFromTree = wrap('getDataFromTree');
export const getMarkupFromTree = wrap('getMarkupFromTree');
export const renderToStringWithData = wrap('renderToStringWithData');

export default global.shims['react-apollo'];
