import { zimletEventEmitter } from '@zimbra-client/util';
import { ZIMBRA_ZIMLET_EVENTS } from '@zimbra-client/constants';

const CACHE_KEY = 'my-zimlet.cache';

export default function Zimlet() {
	return {
		init() {
			// A synchronous listener runs before the Modern UI logs the user out.
			zimletEventEmitter.on(ZIMBRA_ZIMLET_EVENTS.LOGOUT, () => {
				localStorage.removeItem(CACHE_KEY);
			});
		}
	};
}
