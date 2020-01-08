/** This file is an auto-generated shim, aliased in for "@apollo/react-hooks" in the webpack config.
*  When components import '@apollo/react-hooks', we want to give them back the copy
*  Zimbra passed down when it called the factory provided to zimlet().
*/

/* eslint-disable camelcase, dot-notation */
import { warnOnMissingExport } from '../../';
const wrap = warnOnMissingExport.bind(null, global.shims['@apollo/react-hooks'], '@apollo/react-hooks');

export const useApolloClient = wrap('useApolloClient');
export const useLazyQuery = wrap('useLazyQuery');
export const useMutation = wrap('useMutation');
export const useQuery = wrap('useQuery');
export const useSubscription = wrap('useSubscription');
export const ApolloConsumer = wrap('ApolloConsumer');
export const ApolloProvider = wrap('ApolloProvider');
export const resetApolloContext = wrap('resetApolloContext');
export const RenderPromises = wrap('RenderPromises');
export const getApolloContext = wrap('getApolloContext');

export default global.shims['@apollo/react-hooks'];
