import MeetingsTabItem from './components/meetings-tab-item';
import MeetingsLandingItem from './components/meetings-landing-item';
import MeetingsRoute from './components/meetings-route';

export default function Zimlet(context) {
	const { plugins } = context;

	return {
		init() {
			// Adds the tab. The Video vertical appears in the Modern UI when a handler is registered here.
			plugins.register('slot::videoapps-tab-item', MeetingsTabItem);
			// Adds a line to the list of the standard start page of the Video vertical.
			plugins.register('slot::videoapps-landing-page-description', MeetingsLandingItem);
			// Adds the screen that the tab opens.
			plugins.register('slot::routes', MeetingsRoute);
		}
	};
}
