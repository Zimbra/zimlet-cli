/** This file is an auto-generated shim, aliased in for "@zimbra-client/hooks/graphql" in the webpack config.
*  When components import '@zimbra-client/hooks/graphql', we want to give them back the copy
*  Zimbra passed down when it called the factory provided to zimlet().
*/

/* eslint-disable camelcase, dot-notation */
import { warnOnMissingExport } from '../../../';
const wrap = warnOnMissingExport.bind(null, global.shims['@zimbra-client/hooks/graphql'], '@zimbra-client/hooks/graphql');

export const useFoldersQuery = wrap('useFoldersQuery');

export default global.shims['@zimbra-client/hooks/graphql'];
