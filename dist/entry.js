'use strict';

/** This is the real webpack entry file. It manages setting up the zimlet and HMR.
 *  The user-defined entry file (index.js) is imported here via a `zimlet-cli-entrypoint` alias.
 */
(function () {
	function init() {
		zimlet(function (context) {
			var zimbra = context.zimbra,
			    config = context.config,
			    plugins = context.plugins,
			    h = context.h,
			    createElement = context.createElement,
			    cloneElement = context.cloneElement,
			    Component = context.Component,
			    components = context.components;

			global.preact = { h: h, createElement: createElement, cloneElement: cloneElement, Component: Component };
			global.zimbra = zimbra;
			global.config = config;
			global.plugins = plugins;
			global.components = components;

			global.ZIMLET_STYLES = [];

			var entry = require('zimlet-cli-entrypoint');
			var r = entry && entry.default || entry;

			// If export is a factory, pass it context. Otherwise it's a singleton.
			var instance = typeof r === 'function' ? r(context) : r;

			context.styles.set(global.ZIMLET_STYLES.join('\n'));

			return instance;
		});
	}

	init();

	if (process.env.NODE_ENV === 'development' && module.hot) {
		module.hot.accept('zimlet-cli-entrypoint', init);
	}
})();
//# sourceMappingURL=entry.js.map