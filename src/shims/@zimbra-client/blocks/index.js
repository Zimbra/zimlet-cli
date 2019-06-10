/** This file is an auto-generated shim, aliased in for "@zimbra-client/blocks" in the webpack config.
*  When components import '@zimbra-client/blocks', we want to give them back the copy
*  Zimbra passed down when it called the factory provided to zimlet().
*/

/* eslint-disable camelcase, dot-notation */
import { warnOnMissingExport } from '../../';
const wrap = warnOnMissingExport.bind(null, global.shims['@zimbra-client/blocks'], '@zimbra-client/blocks');

export const Dialog = wrap('Dialog');
export const FixedDialog = wrap('FixedDialog');
export const ModalDialog = wrap('ModalDialog');
export const Button = wrap('Button');
export const Select = wrap('Select');
export const Option = wrap('Option');
export const Tabs = wrap('Tabs');
export const Tab = wrap('Tab');
export const Icon = wrap('Icon');
export const FontAwesome = wrap('FontAwesome');
export const Spinner = wrap('Spinner');
export const ClickOutsideDetector = wrap('ClickOutsideDetector');
export const ContainerSize = wrap('ContainerSize');
export const Popover = wrap('Popover');
export const Tooltip = wrap('Tooltip');
export const Scrim = wrap('Scrim');
export const Card = wrap('Card');
export const AffixBottom = wrap('AffixBottom');
export const KeyCodes = wrap('KeyCodes');
export const Label = wrap('Label');

export default global.shims['@zimbra-client/blocks'];
