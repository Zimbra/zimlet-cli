/** This file is an auto-generated shim, aliased in for "preact-router" in the webpack config.
*  When components import 'preact-router', we want to give them back the copy
*  Zimbra passed down when it called the factory provided to zimlet().
*/

/* eslint-disable camelcase, dot-notation */
import { warnOnMissingExport } from '../';
const wrap = warnOnMissingExport.bind(null, global.shims['preactRouter'], 'preact-router');

export const subscribers = wrap('subscribers');
export const getCurrentUrl = wrap('getCurrentUrl');
export const route = wrap('route');
export const Router = wrap('Router');
export const Route = wrap('Route');
export const Link = wrap('Link');
export default global.shims['preactRouter'];
