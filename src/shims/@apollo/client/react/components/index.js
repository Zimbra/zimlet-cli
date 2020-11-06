/** This file is an auto-generated shim, aliased in for "@apollo/client/react/components" in the webpack config.
*  When components import '@apollo/client/react/components', we want to give them back the copy
*  Zimbra passed down when it called the factory provided to zimlet().
*/

/* eslint-disable camelcase, dot-notation */
import { warnOnMissingExport } from '../../../../';
const wrap = warnOnMissingExport.bind(null, global.shims['@apollo/client/react/components'], '@apollo/client/react/components');

export const Mutation = wrap('Mutation');
export const Query = wrap('Query');
export const Subscription = wrap('Subscription');

export default global.shims['@apollo/client/react/components'];
