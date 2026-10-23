import { createElement } from 'preact';
import { zimletEventEmitter } from '@zimbra-client/util';
import { ZIMBRA_ZIMLET_EVENTS } from '@zimbra-client/constants';

export default function Zimlet(context) {
	const { plugins } = context;

	return {
		init() {
			plugins.register('slot::message-body-top', () => <hr />);
			plugins.register('slot::email-landing-page-description', () => <hr />);

			// Remove every handler of this Zimlet when the user signs out.
			zimletEventEmitter.on(ZIMBRA_ZIMLET_EVENTS.LOGOUT, () => plugins.unregisterAll());
		}
	};
}
