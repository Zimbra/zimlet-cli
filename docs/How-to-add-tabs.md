The navigation of the application is updated with a new layout that would comprise of verticals on the top and each of the verticals will have their tab navigation inside the vertical. This change in the core is expected to change the way the zimlets were registering to Menu Item slot and would give developers a new way to register a tab item (menu item) slot to the individual verticals as well.

### Layout of Verticals
![Vertical layout](https://i.gyazo.com/612280a622828c11a60648772d472e6d.png)

As you can see, the icons next to the logo represent the new verticals that are added to the app. They are **email, calendar, videoapps, chatapps, cloudapps, contacts, integrations**.

### To add a permanent tab inside the vertical
If you are developing a zimlet which needs to add a tab inside a vertical, this is the change that it would require to register the zimlet as a tab inside a vertical.

**Contents of the main entry to the zimlet which adds a tab under chatapps vertical along with a route**

````
import { createElement, Fragment } from 'preact';
import { useCallback } from 'preact/hooks';
import { Text } from 'preact-i18n';
import { MenuItem, GenericMobileUISidebar, GenericMobileUIToolbar } from '@zimbra-client/components'; // Sidebar/Toolbar are so nav menu is accessible in mobile
import { Button } from '@zimbra-client/blocks';
import { useClientConfig } from '@zimbra-client/hooks';
import { withIntl } from './enhancers';

const SLUG = 'newtab';

const App = () => {
    const handleClick = useCallback(() => console.log('Test!'), []);
    return (<Fragment>
        <GenericMobileUIToolbar />
        <GenericMobileUISidebar />
        <Button onClick={handleClick}>Zimlet2</Button>
    </Fragment>);
};

export default function Zimlet(context) {
	const { plugins } = context;
	const exports = {};

	// Create a main nav menu item.
	const CustomTabItem = () => { 
		const { slugs } = useClientConfig({ slugs: 'routes.slugs' });
		return (
			<MenuItem responsive icon="user" href={`/${slugs.chatapps}/${SLUG}`}>
				<Text id="newtab.menuItem" />
			</MenuItem>
	        )
	};

	const CustomTab = withIntl()(CustomTabItem)

	exports.init = function init() {
		plugins.register(`slot::chatapps-tab-item`, CustomTab);
		// the registration of Router is necessary to make the URL added in above menu routable
		// which would be added inside the routes in the core app
		plugins.register(`slot::routes`, Router);
	};

	function Router() {
		const { slugs } = useClientConfig({ slugs: 'routes.slugs' });
		return <App path={`/${slugs.chatapps}/${SLUG}`} />;
	}

	return exports;
}


````

### To add a closable tab inside a vertical from zimlet
The component that needs to add a tab, should be wrapped by `withTabManager` decorator exported by the core. 

````
import { createElement, Fragment } from 'preact';
import { Text } from 'preact-i18n';
import { useClientConfig } from '@zimbra-client/hooks';
import { withTabManager, clientConfiguration } from '@zimbra-client/enhancers';
import { compose } from 'recompose';
import { withIntl } from './enhancers';
import { GenericMobileUISidebar, GenericMobileUIToolbar } from '@zimbra-client/components'; // Sidebar/Toolbar are so nav menu is accessible in mobile

const SLUG = 'newtab';

const MyClosableTab = () =>
    (<Fragment>
        <GenericMobileUIToolbar />
        <GenericMobileUISidebar />
        <Text id="myZimletTab.title" />
    </Fragment>);
};

const App = compose(
	withIntl(),
	clientConfiguration({ slugs: 'routes.slugs' }),
	withTabManager(({ slugs }) => ({
		url: `/${slugs.chatapps}/${SLUG}`,
		type: 'my-zimlet-tab',
		id: 'my-zimlet-tab',
		title: 'Zimlet Tab'
	}))
)(MyClosableTab);

export default function Zimlet(context) {
	const { plugins } = context;
	const exports = {};

	exports.init = function init() {
		// the registration of Router is necessary to make the URL added in above menu routable
		// which would be added inside the routes in the core app
		plugins.register(`slot::routes`, Router);
	};

	function Router() {
		const { slugs } = useClientConfig({ slugs: 'routes.slugs' });
		return <App path={`/${slugs.chatapps}/${SLUG}`} />;
	}

	return exports;
}

````

The closable tab will only be added when the user navigates to the specified route, `/${slugs.chatapps}/${SLUG}` in this case. 