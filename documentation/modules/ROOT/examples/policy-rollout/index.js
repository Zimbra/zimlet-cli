import { createElement } from 'preact';
import PolicyNotice from './components/policy-notice';

export default function Zimlet(context) {
	const { plugins } = context;

	return {
		init() {
			// These slots hide a built-in item. The Modern UI checks only whether a handler returned a
			// value, so `true` hides the item and the slot draws nothing.
			plugins.register('slot::print-link', () => true);
			plugins.register('slot::empty-folder-option', () => true);
			// A box in the right column of Mail, Calendar and Contacts. The handler gets `true`, no props.
			plugins.register('slot::adSlot-300-250-top', () => <PolicyNotice />);
		}
	};
}
