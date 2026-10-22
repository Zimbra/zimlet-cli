import { createElement } from 'preact';
import SettingsTitle from './components/settings-title';
import ReminderSettings from './components/reminder-settings';
import { SECTION_ID } from './constants';
import { FIELDS } from './utils/fields';

export default function Zimlet(context) {
	const { plugins } = context;

	return {
		init() {
			// Adds the section to the Settings dialog. The dialog collects every object registered here.
			plugins.register('settings', {
				id: SECTION_ID,
				title: <SettingsTitle />,
				component: ReminderSettings,
				fields: FIELDS
			});
		}
	};
}
