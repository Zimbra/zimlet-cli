import { createElement } from 'preact';
import { useCallback } from 'preact/hooks';
import { useDispatch } from 'react-redux';
import { Text, useText } from '@zimbra/preact-i18n';
import { Button } from '@zimbra-client/blocks';
import { FolderIcon } from 'lucide-preact';
import { saveToTeamDrive } from '../../api/team-drive';
import { withIntl } from '../../enhancers';

// A button of the Save file to dialog. It saves the attachments and reports the result.
const SaveToTeamDrive = ({
	attachments,
	labelId,
	zimbraBatchClient,
	notify,
	buttonClass,
	divClass,
	closeModal
}) => {
	const dispatch = useDispatch();
	const { saved, failed } = useText({
		saved: 'my-zimlet.saved',
		failed: 'my-zimlet.failed'
	});

	const handleClick = useCallback(() => {
		// The dialog does not close when the user chooses a button, so close it first.
		closeModal();

		return saveToTeamDrive(zimbraBatchClient, attachments)
			.then(() => dispatch(notify({ message: saved })))
			.catch(() => dispatch(notify({ message: failed, failure: true })));
	}, [closeModal, zimbraBatchClient, attachments, dispatch, notify, saved, failed]);

	return (
		<div class={divClass}>
			<Button class={buttonClass} icon={FolderIcon} onClick={handleClick}>
				<Text id={labelId} />
			</Button>
		</div>
	);
};

export default withIntl()(SaveToTeamDrive);
