/** This is the real webpack entry file. It manages setting up the zimlet and HMR.
 *  The user-defined entry file (index.js) is imported here via a `zimlet-cli-entrypoint` alias.
 */
( () => {
	function init() {
		zimlet( context => {
			let { zimbra, config, plugins, components, preact } = context;
			global.preact = preact;
			global.zimbra = zimbra;
			global.config = config;
			global.plugins = plugins;
			global.components = components;

			global.ZIMLET_STYLES = [];

			let entry = require('zimlet-cli-entrypoint');
			let r = entry && entry.default || entry;

			// If export is a factory, pass it context. Otherwise it's a singleton.
			let instance = typeof r==='function' ? r(context) : r;

			context.styles.set(global.ZIMLET_STYLES.join('\n'));

			return instance;
		});
	}

	init();

	if (process.env.NODE_ENV==='development' && module.hot) {
		module.hot.accept('zimlet-cli-entrypoint', init);
	}
})();
