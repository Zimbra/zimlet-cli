import { createElement } from 'preact';

// Use localization for visible text in a real Zimlet.
const HELP_LABEL = 'Help desk';

export default function Zimlet(context) {
	const { plugins } = context;

	return {
		init() {
			plugins.register('slot::mail-sidebar-footer', () => (
				<a
					href="https://zimbra.github.io/zimlet-cli/documentation/help"
					target="_blank"
					rel="noopener noreferrer"
				>
					{HELP_LABEL}
				</a>
			));
		}
	};
}
