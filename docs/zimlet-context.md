
## Zimlet Context

The Zimlet context is an object passed into every Zimlet when they are created. Context allows the Zimlet to interact with the main application by registering plugins and adding actions to the redux store. It allows the main application to pass data into a Zimlet, such as useful components.

```js
export default function ExampleZimlet(context) {
	const {
		components,    // re-usable components from the main application
		plugins,       // interact with hooks in the main application, such as Zimlet Slots
		zimbraOrigin,  // the origin of the Zimbra server the client is targetting
		zimlets,       // the Zimlet Manager instance
		zimbra,        // the Zimbra API Client (old/deprecated)
		zimletRedux,   // Hooks for interacting with the Redux store. see [zimlet-redux.md]
		getAccount,    // ¿retreive accoutn data?
		config,        // the config passed into the Zimbra application
		resourceUrl,
		cache,
		h,             // preact dependencies are injected for convenience
		createElement,
		Component,
		cloneElement,
		route,         // route from preact-router will let the Zimlet route the main app
		Link,
		components,    // re-usable components from the main app
		styles,
		keyBindings,   // key bindings in the main app
		shortcutCommandHandler // key binding handlers in the main app
	} = context;
}
```

Use the [`preact-context-provider`](https://github.com/synacor/preact-context-provider/) to pass these values down through your Zimlet.
