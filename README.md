[![CircleCI](https://circleci.com/gh/Zimbra/zimlet-cli.svg?style=shield&circle-token=770fdb94c5adb3ca436855b59c752a77fc4e7fed)](https://circleci.com/gh/Zimbra/zimlet-cli)

# Zimlet CLI

A command-line build tool for next generation Zimlets, powered by Webpack.

### Install

```sh
npm install -g @zimbra/zimlet-cli
```

### Usage

```
zimlet
```

Run the `zimlet` command by itself to see all available options. ZimletCLI makes it easy to get help with the `--help` option available for all commands.

For more help with the available commands, see the [commands documentation](https://github.com/pl12133/zimlet-cli/tree/docs/first-draft/docs/commands.md#TODOChange+Repo+To+Zimbra).

---

## Building Zimlets

### Zimlet Slots

Throughout the Zimbra X app, there are hooks made available to Zimlets for injecting components into the app. These hooks are called `ZimletSlots`.

#### Seeing available zimlet slots

To see which slots are available in the UI, add the query string `?zimletSlots=show` to the end of your URL for the webmail client, e.g. `https://localhost:8080/?zimletSlots=show`.  This will show all of the places in the active UI where ZimletSlots are available, such as the available `menu` slot:

 ![show slot](./showSlot.png)

Slots that are not visible, such as the `routes` slot which allows for add URL routes to screens in the app, will present a message in the browser console, such as:
```
non-visible ZimletSlot name=routes
```

The `ZimletSlot`s will remain visible until the page is refreshed without the `zimletSlots=show` query string.

### Zimlet Lifecycle

The Zimlet will call functions over the course of it's lifecycle, at times such as loading and unloading. `context` is passed into the Zimlet, allowing the Zimlet to interact with the main app; see the [Zimlet Context documentation](https://github.com/pl12133/zimlet-cli/tree/docs/first-draft/docs/zimlet-context.md#TODOChange+Repo+To+Zimbra) for more details.

```js
export default function ExampleZimlet(context) {
	// Create a basic App
	function App() {
		return (
			<div>
				<h2>My Zimlet</h2>
			</div>
		);
	}

	// Router is a Component that returns an Array of Routes
	// Render the Zimlet at path "/my-zimlet"
	function Router(props) {
		return [
			<App path="/my-zimlet" />
		];
	}

	// Create a MenuItem to add to the navigation menu
	function MenuItem(props) {
		return (
			<a href="/my-zimlet">My Zimlet</a>
		);
	}

	return {
		init() {
			console.log('Zimlet Loaded!');

			// add components to ZimletSlots through `context.plugins.register`
			const { plugins } = context;

			// add the MenuItem to the `menu` slot
			plugins.register('slot::menu', MenuItem);

			// add the Router to the `routes` slot
			plugins.register('slot::routes', Router);
		},
		destroy() {
			console.log('Zimlet Unloaded');
		}
	}
}
```

Lifecycle methods allow the Zimlet to set itself up, add content to the page, and clean itself up when it is unloaded.

#### Gotchas

The Zimlet is evaluated in a seperate window with a clean environment. This means common global values like `window.location` will not be available. Instead, many global values are available in the Redux store.

## Hacking on the CLI

Want to work on the CLI? It's easy:

```
# get into this directory:
cd zimlet-cli

# install the dependencies:
npm install

# now any time you change src/ in the CLI package,
# (re-)link your build of the CLI globally:
npm link
```

Doing the above (and repeating the last step for any change to the CLI's source) will introduce a `zimlet` command globally.


## Custom Configuration

#### Webpack

To customize webpack create a `zimlet.config.js` file in the root of your Zimlet which exports a function that will change webpack's config. To use a file other than `zimlet.config.js`, set a custom path as `env.config`.

```js
/**
 * Function that mutates original webpack config.
 *
 * @param {object} config - original webpack config.
 * @param {object} env - options passed to CLI.
 **/
export default function (config, env) {
  /** you can change config here **/
}
```
