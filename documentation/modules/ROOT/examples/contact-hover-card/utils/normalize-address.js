// Addresses are not case sensitive, so the list keeps them in lower case.
export default function normalizeAddress(address) {
	return (address || '').trim().toLowerCase();
}
