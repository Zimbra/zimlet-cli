import { createElement } from 'preact';
import { getPlatformType, PLATFORM_TYPES } from '@zimbra-client/platform';

// Use localization for visible text in a real Zimlet.
const TIP_LABEL = 'Tip: drag a message onto a folder to file it.';
const DISMISS_LABEL = 'Dismiss';

export default function Zimlet(context) {
	const { plugins } = context;

	// Keep one reference: unregister() removes a handler only when it is the same function.
	const Tip = () => (
		<p>
			{TIP_LABEL}
			<button type="button" onClick={dismiss}>
				{DISMISS_LABEL}
			</button>
		</p>
	);

	function dismiss() {
		plugins.unregister('slot::folder-list-end', Tip);
	}

	return {
		init() {
			// Dragging needs a mouse, so show the tip only in the web client.
			if (getPlatformType() !== PLATFORM_TYPES.WEB) {
				return;
			}

			plugins.register('slot::folder-list-end', Tip);
		}
	};
}
