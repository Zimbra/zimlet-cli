import { zimletEventEmitter } from '@zimbra-client/util';
import { ZIMBRA_ZIMLET_EVENTS } from '@zimbra-client/constants';

export default function Zimlet(context) {
	const { zimlets } = context;

	return {
		init() {
			zimletEventEmitter.on(ZIMBRA_ZIMLET_EVENTS.ONBEFORESEND, ({ message }) => {
				// Each Zimlet that registered a check under this key adds one result.
				const problems = zimlets.invokePlugin('my-checks.before-send', message).filter(Boolean);

				if (problems.length) {
					console.warn('Check before sending:', problems);
				}
			});
		}
	};
}
