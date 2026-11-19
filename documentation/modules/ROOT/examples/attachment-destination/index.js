import { createElement } from 'preact';
import SaveToTeamDrive from './components/save-to-team-drive';

export default function Zimlet(context) {
	const { plugins, store, zimbraBatchClient } = context;

	return {
		init() {
			// The dialog that saves one attachment. It passes `attachment` and the classes of its buttons.
			plugins.register(
				'slot::attachment-single-action',
				({ attachment, buttonClass, divClass, closeModal }) => {
					// Read the action when you use it: the object is built from the current registry.
					const { notify } = store.zimletRedux.actions.notifications;

					return (
						<SaveToTeamDrive
							attachments={[attachment]}
							labelId="my-zimlet.saveOne"
							zimbraBatchClient={zimbraBatchClient}
							notify={notify}
							buttonClass={buttonClass}
							divClass={divClass}
							closeModal={closeModal}
						/>
					);
				}
			);
			// The dialog that saves several attachments. It passes `attachments` instead.
			plugins.register(
				'slot::attachment-multi-action',
				({ attachments, buttonClass, divClass, closeModal }) => {
					const { notify } = store.zimletRedux.actions.notifications;

					return (
						<SaveToTeamDrive
							attachments={attachments}
							labelId="my-zimlet.saveAll"
							zimbraBatchClient={zimbraBatchClient}
							notify={notify}
							buttonClass={buttonClass}
							divClass={divClass}
							closeModal={closeModal}
						/>
					);
				}
			);
		}
	};
}
