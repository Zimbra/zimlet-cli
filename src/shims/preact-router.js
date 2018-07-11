/** This file is a shim, aliased in for "preact-router" in the webpack config.
 *  When components import 'preact-router', we want to give them back the copy
 *  Zimbra passed down when it called the factory provided to zimlet().
 */

const { route, Link } = global.shims.preactRouter;

export { route, Link };
export default global.shims.preactRouter;
