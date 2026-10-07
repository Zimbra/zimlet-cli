Many components from the main application, such as `Buttons`, `MenuItem`, `Sidebar`, etc. are passed down as values in the Components object.  They are passed down rather than being imported from a separate repo at build time for a few reasons:
1. The zimlet build size is smaller if it doesn't have to bundle in the components it re-uses
2. You are guaranteed that the styling and behavior of components in your zimlet will be the same as that of the main app, making for a more seamless experience.  

## Finding the component to re-use
One of the easiest ways to figure out the name of a component that you might want to re-use is to inspect the element on the page with your browsers debugging tools to find the class(es) applied to the component.  We use CSS modules to name our CSS classes automatically in the form of `<package-name>_<component-name>_<class-name>`.  `<package-name>` is `zimlet-client` (subject to change) for the Zimbra X UI.

Below is an example of inspecting the calendar `<MenuItem />` component.  You can see that it has a class of `zimbra-client_menu-item_namItem`, which means it is the `.navItem` class in the `MenuItem` component in the `zimbra-client` repo.

[![https://gyazo.com/9479c170882f48ea1b29dd2ac11a0cbe](https://i.gyazo.com/9479c170882f48ea1b29dd2ac11a0cbe.png)](https://gyazo.com/9479c170882f48ea1b29dd2ac11a0cbe)

## Using a Component
In a regular Preact app, you would re-use a component by doing something like:
```js
import SomeComponent from '../some-component';

export function MyComponent = (props) => (
    <div>
        <SomeComponent aProp={props.foo} />
    </div>
)
```

However, since `import` is a build-time statement and the zimlet gets the components at runtime, that won't work.  You are given the `components` object as part of the context when your zimlet is initialized, so we can use them as `prop` and/or `context` to pass them from the intialization of the zimlet down to a component in your zimlet that needs it:

#### Example: 
Components can be directly re-used when called from the initialization function, like the `MenuItem` component below.  If used deeper in the zimlet codebase, it is best to provide it through preact's context, like how the `MyComponent` re-uses the `Button` component from the main app.

**Main Entry to your zimlet:**
```js
import { h } from 'preact';
import createApp from './components/app';

export default function Zimlet(context) {
	const { plugins, components } = context;
	const exports = {};

        // App will give components and other stuff from the zimlet context to its children via preact's context
	const App = createApp(context); 
	
	exports.init = function init() {
		plugins.register('slot::menu', MenuItem);
		plugins.register('slot::routes', Router);
	};

	// Register a new route with the preact-router instance
	function Router() {
		return [
                        //Mount the "App" component when someone navigates to /example
			<App path={`/example`} />
		];
	}

	// Re-use MenuItem from the parent to create a menu item that when clicked goes to /example
	const MenuItem = 
		<components.MenuItem responsive icon="paperclip" href={`/example`} >
			My Zimlet!!
		</components.MenuItem>
	));

	return exports;
}
```

**App.js that provides components down through context:**
```js
import { h, Component } from 'preact';
import { provide } from 'preact-context-provider';

export default function createApp(context) {

        //use preact-context-provider to put components into preact's context under the zimbraComponents key
	@provide({ zimbraComponents: context.components })
	class App extends Component {

		render() {
			return (
				<div>
				  <MyComponent />
				</div>
			);
		}
	}

	return App;

}
```

**my-component.js:**
```js
import { h, Component } from 'preact';
import wire from 'wiretie';

// Use wiretie or some other library/function to get it out of context and put it in props.
// You could access context directly in the render method, but it makes it much harder to unit test your
// components if you do that
@wire('zimbraComponents', null, ({Button}) => ({
    Button
})
export default class MyComponent extends Component{

    //Now the re-usable Button component is a prop that you can use
    render({Button}) {
        return (
            <div>
                <Button onClick={ }>I re-used a Button!</Button>
	    </div>
        );
    }
}
```