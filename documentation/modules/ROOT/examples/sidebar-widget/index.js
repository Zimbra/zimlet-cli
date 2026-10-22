import { createElement } from 'preact';
import HeadOfficeClock from './components/head-office-clock';

export default function Zimlet(context) {
	const { plugins } = context;

	return {
		init() {
			// The panel at the right of the Mail, Calendar, Contacts and Briefcase screens.
			plugins.register('slot::rightside-zimlet-slot', () => <HeadOfficeClock />);
		}
	};
}
