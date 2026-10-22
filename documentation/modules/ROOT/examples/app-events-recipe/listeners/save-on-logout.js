import { createElement } from 'preact';
import { saveApprovedDomains } from '../api/approved-domains';
import SavingDialog from '../components/saving-dialog';
import { SAVING_DIALOG_ID } from '../constants';
import { getApproved, hasChanges, markSaved } from '../state/approved-domains';

export default function createSaveOnLogout(context) {
	const { store, zimbraBatchClient } = context;
	const { dispatch, zimletRedux } = store;
	const { addModal, removeModal } = zimletRedux.actions.zimlets;

	// An asynchronous LOGOUT listener: the Modern UI logs the user out when the promise resolves.
	return () => {
		if (!hasChanges()) {
			return Promise.resolve();
		}

		dispatch(addModal({ id: SAVING_DIALOG_ID, modal: <SavingDialog /> }));

		return saveApprovedDomains(zimbraBatchClient, getApproved())
			.then(markSaved)
			.catch(error => console.error(error))
			.finally(() => dispatch(removeModal({ id: SAVING_DIALOG_ID })));
	};
}
