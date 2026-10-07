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
