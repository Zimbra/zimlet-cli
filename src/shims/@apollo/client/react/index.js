/** This file is an auto-generated shim, aliased in for "@apollo/client/react" in the webpack config.
*  When components import '@apollo/client/react', we want to give them back the copy
*  Zimbra passed down when it called the factory provided to zimlet().
*/

/* eslint-disable camelcase, dot-notation */
import { warnOnMissingExport } from '../../../';
const wrap = warnOnMissingExport.bind(null, global.shims['@apollo/client/react'], '@apollo/client/react');

export const useApolloClient = wrap('useApolloClient');
export const useLazyQuery = wrap('useLazyQuery');
export const useMutation = wrap('useMutation');
export const useQuery = wrap('useQuery');
export const useReactiveVar = wrap('useReactiveVar');
export const useSubscription = wrap('useSubscription');
export const ApolloConsumer = wrap('ApolloConsumer');
export const ApolloProvider = wrap('ApolloProvider');
export const getApolloContext = wrap('getApolloContext');
export const resetApolloContext = wrap('resetApolloContext');
export const DocumentType = wrap('DocumentType');
export const operationName = wrap('operationName');
export const parser = wrap('parser');

export default global.shims['@apollo/client/react'];
