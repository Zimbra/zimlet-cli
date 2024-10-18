/** This file is an auto-generated shim, aliased in for "@zimbra-client/hooks/graphql" in the webpack config.
*  When components import '@zimbra-client/hooks/graphql', we want to give them back the copy
*  Zimbra passed down when it called the factory provided to zimlet().
*/

/* eslint-disable camelcase, dot-notation */
import { warnOnMissingExport } from '../../../';
const wrap = warnOnMissingExport.bind(null, global.shims['@zimbra-client/hooks/graphql'], '@zimbra-client/hooks/graphql');

export const useFoldersQuery = wrap('useFoldersQuery');
export const useAccountInfo = wrap('useAccountInfo');
export const useDocumentAction = wrap('useDocumentAction');
export const useBriefcaseFoldersQuery = wrap('useBriefcaseFoldersQuery');
export const useCustomMetaData = wrap('useCustomMetaData');
export const useCustomMetaDataMutation = wrap('useCustomMetaDataMutation');
export const useSaveDocumentMutation = wrap('useSaveDocumentMutation');
export const useCreateFolderMutation = wrap('useCreateFolderMutation');
export const useFolderActionMutation = wrap('useFolderActionMutation');
export const useCalendarsData = wrap('useCalendarsData');

export default global.shims['@zimbra-client/hooks/graphql'];
