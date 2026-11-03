import { createElement } from 'preact';
import ExportEventItem from './components/export-event-item';

export default function Zimlet(context) {
	const { plugins, zimbraBatchClient } = context;

	return {
		init() {
			// One handler fills both slots, so the item is in the context menu and in the More Options menu.
			const handler = props => <ExportEventItem zimbraBatchClient={zimbraBatchClient} {...props} />;

			plugins.register('slot::action-menu-event-context-menu', handler);
			plugins.register('slot::action-menu-event-more', handler);
		}
	};
}
