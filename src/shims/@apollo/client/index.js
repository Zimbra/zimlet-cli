/** This file is an auto-generated shim, aliased in for "@apollo/client" in the webpack config.
*  When components import '@apollo/client', we want to give them back the copy
*  Zimbra passed down when it called the factory provided to zimlet().
*/

/* eslint-disable camelcase, dot-notation */
import { warnOnMissingExport } from '../../';
const wrap = warnOnMissingExport.bind(null, global.shims['@apollo/client'], '@apollo/client');

export const NetworkStatus = wrap('NetworkStatus');
export const DocumentTransform = wrap('DocumentTransform');
export const Observable = wrap('Observable');
export const isReference = wrap('isReference');
export const makeReference = wrap('makeReference');
export const mergeOptions = wrap('mergeOptions');
export const ApolloCache = wrap('ApolloCache');
export const Cache = wrap('Cache');
export const InMemoryCache = wrap('InMemoryCache');
export const MissingFieldError = wrap('MissingFieldError');
export const defaultDataIdFromObject = wrap('defaultDataIdFromObject');
export const makeVar = wrap('makeVar');
export const ApolloError = wrap('ApolloError');
export const isApolloError = wrap('isApolloError');
export const fromError = wrap('fromError');
export const fromPromise = wrap('fromPromise');
export const throwServerError = wrap('throwServerError');
export const toPromise = wrap('toPromise');
export const setLogVerbosity = wrap('setLogVerbosity');
export const disableExperimentalFragmentVariables = wrap('disableExperimentalFragmentVariables');
export const disableFragmentWarnings = wrap('disableFragmentWarnings');
export const enableExperimentalFragmentVariables = wrap('enableExperimentalFragmentVariables');
export const gql = wrap('gql');
export const resetCaches = wrap('resetCaches');
export const ApolloClient = wrap('ApolloClient');
export const ObservableQuery = wrap('ObservableQuery');
export const isNetworkRequestSettled = wrap('isNetworkRequestSettled');
export const ApolloLink = wrap('ApolloLink');
export const concat = wrap('concat');
export const empty = wrap('empty');
export const execute = wrap('execute');
export const from = wrap('from');
export const split = wrap('split');
export const HttpLink = wrap('HttpLink');
export const checkFetcher = wrap('checkFetcher');
export const createHttpLink = wrap('createHttpLink');
export const createSignalIfSupported = wrap('createSignalIfSupported');
export const defaultPrinter = wrap('defaultPrinter');
export const fallbackHttpConfig = wrap('fallbackHttpConfig');
export const parseAndCheckHttpResponse = wrap('parseAndCheckHttpResponse');
export const rewriteURIForGET = wrap('rewriteURIForGET');
export const selectHttpOptionsAndBody = wrap('selectHttpOptionsAndBody');
export const selectHttpOptionsAndBodyInternal = wrap('selectHttpOptionsAndBodyInternal');
export const selectURI = wrap('selectURI');
export const serializeFetchParameter = wrap('serializeFetchParameter');
export const ApolloConsumer = wrap('ApolloConsumer');
export const ApolloProvider = wrap('ApolloProvider');
export const getApolloContext = wrap('getApolloContext');
export const resetApolloContext = wrap('resetApolloContext');
export const DocumentType = wrap('DocumentType');
export const operationName = wrap('operationName');
export const parser = wrap('parser');
export const skipToken = wrap('skipToken');
export const useApolloClient = wrap('useApolloClient');
export const useBackgroundQuery = wrap('useBackgroundQuery');
export const useFragment = wrap('useFragment');
export const useLazyQuery = wrap('useLazyQuery');
export const useMutation = wrap('useMutation');
export const useQuery = wrap('useQuery');
export const useReactiveVar = wrap('useReactiveVar');
export const useReadQuery = wrap('useReadQuery');
export const useSubscription = wrap('useSubscription');
export const useSuspenseQuery = wrap('useSuspenseQuery');

export default global.shims['@apollo/client'];
