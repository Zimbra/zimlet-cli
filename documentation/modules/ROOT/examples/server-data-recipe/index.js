import PartnersTabItem from './components/partners-tab-item';
import createPartnersRoute from './components/partners-route';

export default function Zimlet(context) {
	const { plugins, zimbraBatchClient } = context;

	return {
		init() {
			// Adds the tab to the Contacts area.
			plugins.register('slot::contacts-tab-item', PartnersTabItem);
			// Adds the screen that the tab opens, with the client that sends the requests.
			plugins.register('slot::routes', createPartnersRoute(zimbraBatchClient));
		}
	};
}
