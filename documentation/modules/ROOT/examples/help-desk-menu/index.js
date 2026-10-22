import { createElement } from 'preact';
import { LifeBuoyIcon } from 'lucide-preact';
import MenuLink from './components/menu-link';
import ReportProblem from './components/report-problem';
import { HELP_DESK_URL, ACCOUNT_URL } from './constants';

export default function Zimlet(context) {
	const { plugins } = context;

	return {
		init() {
			// Settings and more menu, after the built-in Help item.
			plugins.register('slot::settings-dropdown-item-end', () => (
				<MenuLink url={HELP_DESK_URL} icon={LifeBuoyIcon} labelId="my-zimlet.helpDesk" />
			));
			// Account menu, above Logout.
			plugins.register('slot::header-menu-item', () => (
				<MenuLink url={ACCOUNT_URL} labelId="my-zimlet.manageAccount" />
			));
			// Settings and more menu, below About.
			plugins.register('slot::gear-menu', () => <ReportProblem />);
		}
	};
}
