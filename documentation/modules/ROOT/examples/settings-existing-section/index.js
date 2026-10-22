import { createElement } from 'preact';
import ClosingPhrase from './components/closing-phrase';
import { SECTION_ID } from './constants';
import { FIELDS } from './utils/fields';

export default function Zimlet(context) {
	const { plugins } = context;

	return {
		init() {
			// Draws the control inside the Writing Email page, after its built-in settings.
			plugins.register('slot::writting-email-additional-settings', props => (
				<ClosingPhrase {...props} />
			));

			// Adds the field to the Writing Email page. With the id of a built-in page, the dialog
			// merges the fields and ignores a title or a component.
			plugins.register('settings', {
				id: SECTION_ID,
				fields: FIELDS
			});
		}
	};
}
