/** This file is an auto-generated shim, aliased in for "@apollo/client/react/hoc" in the webpack config.
*  When components import '@apollo/client/react/hoc', we want to give them back the copy
*  Zimbra passed down when it called the factory provided to zimlet().
*/

/* eslint-disable camelcase, dot-notation */
import { warnOnMissingExport } from '../../../../';
const wrap = warnOnMissingExport.bind(null, global.shims['@apollo/client/react/hoc'], '@apollo/client/react/hoc');

export const graphql = wrap('graphql');
export const withApollo = wrap('withApollo');
export const withMutation = wrap('withMutation');
export const withQuery = wrap('withQuery');
export const withSubscription = wrap('withSubscription');

export default global.shims['@apollo/client/react/hoc'];
