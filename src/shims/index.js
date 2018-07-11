/**
 * A shimmed module is injected into the global object by the parent app.
 * The shimmed module is then aliased as the real module, and Zimlet consumers
 * will not need to duplicate libraries used by the main app.
 */

export function getShimPath(module) {
	return require.resolve(`./${module}`);
}
