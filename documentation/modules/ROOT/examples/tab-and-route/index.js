import MeetingsTabItem from './components/meetings-tab-item';
import MeetingsRoute from './components/meetings-route';

export default function Zimlet(context) {
	const { plugins } = context;

	return {
		init() {
			// Adds the tab. The Video area appears in the Modern UI when a handler is registered here.
			plugins.register('slot::videoapps-tab-item', MeetingsTabItem);
			// Adds the screen that the tab opens.
			plugins.register('slot::routes', MeetingsRoute);
		}
	};
}
