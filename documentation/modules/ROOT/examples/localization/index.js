import { createElement } from 'preact';
import Reminder from './components/Reminder';

export default function Zimlet(context) {
	const { plugins } = context;

	return {
		init() {
			plugins.register('slot::mail-sidebar-footer', () => <Reminder count={3} />);
		}
	};
}
