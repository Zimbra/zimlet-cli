import { createElement } from 'preact';
import PrivacyBlur from './components/privacy-blur';
import { SHORTCUT_BINDINGS } from './constants';

export default function Zimlet(context) {
	const { plugins, keyBindings, shortcutCommandHandler } = context;

	return {
		init() {
			// Press Y, then B, to show the screen after the Zimlet has hidden it.
			keyBindings.addBindings(SHORTCUT_BINDINGS);

			// The app slot is not tied to a screen. The component shows nothing until the screen is hidden.
			plugins.register('slot::app', () => (
				<PrivacyBlur shortcutCommandHandler={shortcutCommandHandler} />
			));
		}
	};
}
