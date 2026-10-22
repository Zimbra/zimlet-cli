import { zimletEventEmitter } from '@zimbra-client/util';
import { ZIMBRA_ZIMLET_EVENTS } from '@zimbra-client/constants';
import { readApprovedDomains } from './api/approved-domains';
import createCheckRecipients from './listeners/check-recipients';
import createSaveOnLogout from './listeners/save-on-logout';
import { setApproved } from './state/approved-domains';

export default function Zimlet(context) {
	const { zimbraBatchClient } = context;

	// Keep each listener in a variable, so that you can remove it with the same function later.
	const checkRecipients = createCheckRecipients(context);
	const saveOnLogout = createSaveOnLogout(context);

	return {
		init() {
			// Load the domains that the user approved in earlier sessions.
			readApprovedDomains(zimbraBatchClient)
				.then(setApproved)
				.catch(error => console.error(error));

			// The third argument marks each listener as asynchronous, so the Modern UI waits for it.
			zimletEventEmitter.on(ZIMBRA_ZIMLET_EVENTS.ONBEFORESEND, checkRecipients, true);
			zimletEventEmitter.on(ZIMBRA_ZIMLET_EVENTS.LOGOUT, saveOnLogout, true);
		}
	};
}
