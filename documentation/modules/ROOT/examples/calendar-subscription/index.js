import { createElement } from 'preact';
import SubscribeDialog from './components/subscribe-dialog';
import SubscribeMenuItem from './components/subscribe-menu-item';
import SubscribedCalendars from './components/subscribed-calendars';

export default function Zimlet(context) {
	const { plugins, zimbraBatchClient } = context;
	// The actions that store and remove the flag of the dialog. The components dispatch them.
	const { addSlot, removeSlot } = context.store.zimletRedux.actions.zimlets;

	return {
		init() {
			// The item in the menu that manages the calendars of other users. It passes no props.
			plugins.register('slot::calendar-subscription-menu', () => (
				<SubscribeMenuItem addSlot={addSlot} />
			));
			// The Calendar draws this slot all the time. `isActive` is the flag of the dialog.
			plugins.register(
				'slot::calendar-subscription-modal-flow',
				({ isActive, refetchCalendars }) =>
					isActive ? (
						<SubscribeDialog
							removeSlot={removeSlot}
							zimbraBatchClient={zimbraBatchClient}
							refetchCalendars={refetchCalendars}
						/>
					) : null
			);
			// The sidebar draws this slot in three groups. `isActive` is `true` in the group Others.
			plugins.register('slot::calendar-subscription-list', ({ isActive, renderItem }) =>
				isActive ? <SubscribedCalendars renderItem={renderItem} /> : null
			);
		}
	};
}
