/** This file is an auto-generated shim, aliased in for "@zimbra-client/hooks" in the webpack config.
*  When components import '@zimbra-client/hooks', we want to give them back the copy
*  Zimbra passed down when it called the factory provided to zimlet().
*/

/* eslint-disable camelcase, dot-notation */
import { warnOnMissingExport } from '../../';
const wrap = warnOnMissingExport.bind(null, global.shims['@zimbra-client/hooks'], '@zimbra-client/hooks');

export const useClientConfig = wrap('useClientConfig');
export const useTracking = wrap('useTracking');
export const useMediaQuery = wrap('useMediaQuery');
export const usePreferences = wrap('usePreferences');
export const useSendMessageMutation = wrap('useSendMessageMutation');
export const useOriginalMsgHeader = wrap('useOriginalMsgHeader');
export const useItemActionMutation = wrap('useItemActionMutation');

export default global.shims['@zimbra-client/hooks'];
