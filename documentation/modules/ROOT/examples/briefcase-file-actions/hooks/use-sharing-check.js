import { createElement } from 'preact';
import { useCallback } from 'preact/hooks';
import { useDispatch } from 'react-redux';
import CheckResultDialog from '../components/check-result-dialog';
import { DIALOG_ID } from '../constants';
import checkFile from '../utils/check-file';
import getFiles from '../utils/get-files';

// Checks the selected files and shows the result in a dialog.
export default function useSharingCheck(addModal, removeModal, selectedList) {
	const dispatch = useDispatch();
	const files = getFiles(selectedList);

	const closeDialog = useCallback(() => {
		dispatch(removeModal({ id: DIALOG_ID }));
	}, [dispatch, removeModal]);

	const runCheck = useCallback(() => {
		const results = files.map(file => ({
			id: file.id,
			name: file.name,
			problem: checkFile(file)
		}));

		dispatch(
			addModal({
				id: DIALOG_ID,
				modal: <CheckResultDialog results={results} onClose={closeDialog} />
			})
		);
	}, [dispatch, addModal, files, closeDialog]);

	return { hasFiles: files.length > 0, runCheck };
}
