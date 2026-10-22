import { zimletEventEmitter } from '@zimbra-client/util';
import { ZIMBRA_ZIMLET_EVENTS } from '@zimbra-client/constants';

const SENT_COUNT_KEY = 'my-zimlet.sent-count';

// A Zimlet with no UI: it registers no slot handler and only reacts to an event.
export default function Zimlet() {
	return {
		init() {
			// Keep a running count of sent messages. localStorage survives a page reload.
			zimletEventEmitter.on(ZIMBRA_ZIMLET_EVENTS.AFTERONSEND, () => {
				const count = Number(localStorage.getItem(SENT_COUNT_KEY)) || 0;
				localStorage.setItem(SENT_COUNT_KEY, String(count + 1));
			});
		}
	};
}
