import { zimletEventEmitter } from '@zimbra-client/util';
import { ZIMBRA_ZIMLET_EVENTS } from '@zimbra-client/constants';

// Use localization for visible text in a real Zimlet.
const FIRST_SENT_LABEL = 'Your first message is sent.';

export default function Zimlet(context) {
	const { store } = context;
	const { notifications } = store.zimletRedux.actions;

	return {
		init() {
			const onFirstSent = () => {
				store.dispatch(notifications.notify({ message: FIRST_SENT_LABEL }));
				// Remove the listener, so that it runs once.
				zimletEventEmitter.off(ZIMBRA_ZIMLET_EVENTS.AFTERONSEND, onFirstSent);
			};

			zimletEventEmitter.on(ZIMBRA_ZIMLET_EVENTS.AFTERONSEND, onFirstSent);
		}
	};
}
