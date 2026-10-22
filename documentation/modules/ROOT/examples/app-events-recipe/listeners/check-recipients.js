import { createElement } from 'preact';
import ExternalRecipientsDialog from '../components/external-recipients-dialog';
import { EXTERNAL_DIALOG_ID, INTERNAL_DOMAIN } from '../constants';
import { approve, isApproved } from '../state/approved-domains';
import { getDomain } from '../utils/get-domain';

export default function createCheckRecipients(context) {
	const { dispatch, zimletRedux } = context.store;
	const { addModal, removeModal } = zimletRedux.actions.zimlets;

	// An asynchronous ONBEFORESEND listener: the Modern UI sends the message when the promise resolves.
	return ({ message }) => {
		const recipients = [...(message.to ?? []), ...(message.cc ?? []), ...(message.bcc ?? [])];
		const addresses = recipients
			.map(({ address }) => address)
			.filter(address => {
				const domain = getDomain(address);
				return domain !== INTERNAL_DOMAIN && !isApproved(domain);
			});

		if (!addresses.length) {
			return Promise.resolve();
		}

		return new Promise((resolve, reject) => {
			const onResult = confirmed => {
				dispatch(removeModal({ id: EXTERNAL_DIALOG_ID }));
				if (confirmed) {
					approve(addresses.map(getDomain));
					resolve();
				} else {
					reject(new Error('The user stopped the message.'));
				}
			};

			const dialogProps = { addresses, onResult };
			dispatch(
				addModal({ id: EXTERNAL_DIALOG_ID, modal: <ExternalRecipientsDialog {...dialogProps} /> })
			);
		});
	};
}
