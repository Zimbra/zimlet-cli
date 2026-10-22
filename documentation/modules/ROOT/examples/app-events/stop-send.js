import { zimletEventEmitter } from '@zimbra-client/util';
import { ZIMBRA_ZIMLET_EVENTS } from '@zimbra-client/constants';

// Use localization for visible text in a real Zimlet.
const EMPTY_SUBJECT_LABEL = 'Add a subject before you send the message.';

export default function Zimlet(context) {
	const { store } = context;
	const { notifications } = store.zimletRedux.actions;

	return {
		init() {
			// The third argument marks the listener as asynchronous.
			zimletEventEmitter.on(
				ZIMBRA_ZIMLET_EVENTS.ONBEFORESEND,
				({ message }) => {
					if (message.subject) {
						return Promise.resolve();
					}
					store.dispatch(notifications.notify({ message: EMPTY_SUBJECT_LABEL }));
					return Promise.reject(new Error('The subject is empty.'));
				},
				true
			);
		}
	};
}
