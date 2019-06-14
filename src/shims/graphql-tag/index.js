/** This file is an auto-generated shim, aliased in for "graphql-tag" in the webpack config.
*  When components import 'graphql-tag', we want to give them back the copy
*  Zimbra passed down when it called the factory provided to zimlet().
*/

/* eslint-disable camelcase, dot-notation */
import { warnOnMissingExport } from '../';
const wrap = warnOnMissingExport.bind(null, global.shims['graphql-tag'], 'graphql-tag');

export default wrap('default');

