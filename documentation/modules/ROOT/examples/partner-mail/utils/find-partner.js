import { PARTNERS } from '../constants';

// Returns the partner of the first sender whose domain is on the list, or undefined.
export function findPartner(mailItem) {
	const senders = mailItem?.emailAddresses?.filter(({ type }) => type === 'f') ?? [];

	for (const { address } of senders) {
		const domain = address?.split('@')[1]?.toLowerCase();
		const partner = PARTNERS.find(item => item.domain === domain);
		if (partner) {
			return partner;
		}
	}
}
