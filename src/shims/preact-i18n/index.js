/** This file is an auto-generated shim, aliased in for "preact-i18n" in the webpack config.
*  When components import 'preact-i18n', we want to give them back the copy
*  Zimbra passed down when it called the factory provided to zimlet().
*/

/* eslint-disable camelcase, dot-notation */
import { warnOnMissingExport } from '../';
const wrap = warnOnMissingExport.bind(null, global.shims['preact-i18n'], 'preact-i18n');

export const IntlProvider = wrap('IntlProvider');
export const Localizer = wrap('Localizer');
export const MarkupText = wrap('MarkupText');
export const Text = wrap('Text');
export default wrap('default');
export const intl = wrap('intl');
export const withText = wrap('withText');

