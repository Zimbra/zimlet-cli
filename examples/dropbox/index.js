import Page from './components/page';
import style from './style.css';

const dropBoxKeyBindings = {
	all: {
		G: {
			D: 'GO_TO_DROPBOX' // Creat
		}
	},
	dropbox: {
		'ctrl+A': 'DROPBOX_ALERT' //show a window.alert when user presses ctrl+A, but only when the dropbox Page component is mounted
	}
};

export default (context) => {
	let { plugins, components, keyBindings, shortcutCommandHandler, route } = context;
	console.log('dropbox: construct', context, style);

	let exports = {};

	const globalShortcutHandlers = [{ context: 'all', command: 'GO_TO_DROPBOX', handler: () => route('/dropbox') }];

	exports.init = function () {

		console.log('In Dropbox zimlet.  route is:', route);

		// console.log('dropbox: init');
		plugins.register('slot::menu', MenuItem);
		plugins.register('slot::routes', Router);

		//add all keybindings that this zimlet needs
		keyBindings.addBindings(dropBoxKeyBindings);

		//register command handlers that will be in effect even when the dropbox tab is not active
		shortcutCommandHandler.addCommandHandlers(globalShortcutHandlers);
	};

	exports.unload = function () {
		//remove key bindings
		keyBindings.removeBindings(['all.G.D', 'dropbox']);

		//un-register global command handlers
		shortcutCommandHandler.removeCommandHandlers(globalShortcutHandlers);
	};

	function Router() {
		return [
			<Page path="/dropbox" />
		];
	}

	function MenuItem() {
		return (
			<components.MenuItem
				responsive
				icon="file-archive-o"
				href="/dropbox"
				class="dropbox-menu-item"
			>
				Dropbox
			</components.MenuItem>
		);
	}

	return exports;
};
