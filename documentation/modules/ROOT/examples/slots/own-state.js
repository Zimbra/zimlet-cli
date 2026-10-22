import { createElement } from 'preact';
import { useCallback, useState } from 'preact/hooks';

// Use localization for visible text in a real Zimlet.
const NOTICE_LABEL = 'Check the sender before you follow a link.';
const DISMISS_LABEL = 'Dismiss';

// A component keeps its own hook state, apart from the other handlers of the slot.
function Notice() {
	const [dismissed, setDismissed] = useState(false);
	const dismiss = useCallback(() => setDismissed(true), []);

	if (dismissed) {
		return null;
	}

	return (
		<p>
			{NOTICE_LABEL}
			<button type="button" onClick={dismiss}>
				{DISMISS_LABEL}
			</button>
		</p>
	);
}

export default function Zimlet(context) {
	const { plugins } = context;

	return {
		init() {
			plugins.register('slot::message-body-top', () => <Notice />);
		}
	};
}
