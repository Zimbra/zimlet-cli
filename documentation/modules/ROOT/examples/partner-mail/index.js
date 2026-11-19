import { createElement } from 'preact';
import PartnerFolderGroup from './components/partner-folder-group';
import PartnerSender from './components/partner-sender';
import { findPartner } from './utils/find-partner';

export default function Zimlet(context) {
	const { plugins } = context;

	return {
		init() {
			// The sender names in a row of the message list. It passes `emailAddresses` and
			// `mailItem`. A handler that returns `null` keeps the standard names.
			plugins.register('slot::mail-sender', ({ emailAddresses, mailItem }) =>
				findPartner(mailItem) ? <PartnerSender emailAddresses={emailAddresses} /> : null
			);
			// A group in the folder list of every vertical. It passes no props.
			plugins.register('slot::folder-group', () => <PartnerFolderGroup />);
		}
	};
}
