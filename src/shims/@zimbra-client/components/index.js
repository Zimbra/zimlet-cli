/** This file is an auto-generated shim, aliased in for "@zimbra-client/components" in the webpack config.
*  When components import '@zimbra-client/components', we want to give them back the copy
*  Zimbra passed down when it called the factory provided to zimlet().
*/

/* eslint-disable camelcase, dot-notation */
import { warnOnMissingExport } from '../../';
const wrap = warnOnMissingExport.bind(null, global.shims['@zimbra-client/components'], '@zimbra-client/components');

export const ModalDrawer = wrap('ModalDrawer');
export const ModalDrawerToolbar = wrap('ModalDrawerToolbar');
export const BackArrow = wrap('BackArrow');
export const Select = wrap('Select');
export const NakedButton = wrap('NakedButton');
export const TextInput = wrap('TextInput');

export default global.shims['@zimbra-client/components'];
