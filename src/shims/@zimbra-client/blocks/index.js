/** This file is an auto-generated shim, aliased in for "@zimbra-client/blocks" in the webpack config.
*  When components import '@zimbra-client/blocks', we want to give them back the copy
*  Zimbra passed down when it called the factory provided to zimlet().
*/

/* eslint-disable camelcase, dot-notation */
import { warnOnMissingExport } from '../../';
const wrap = warnOnMissingExport.bind(null, global.shims['@zimbra-client/blocks'], '@zimbra-client/blocks');

export const Icon = wrap('Icon');
export const Button = wrap('Button');
export const Spinner = wrap('Spinner');
export const ModalDialog = wrap('ModalDialog');
export default global.shims['@zimbra-client/blocks'];
