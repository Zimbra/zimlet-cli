import { createElement } from 'preact';
import FollowUpItem from './components/follow-up-item';

export default function Zimlet(context) {
	const { plugins, store, zimbraBatchClient } = context;

	return {
		init() {
			plugins.register('slot::action-menu-mail-more', props => {
				// Read the actions when you use them: the object is built from the current registry.
				const { notify } = store.zimletRedux.actions.notifications;

				return <FollowUpItem zimbraBatchClient={zimbraBatchClient} notify={notify} {...props} />;
			});
		}
	};
}
