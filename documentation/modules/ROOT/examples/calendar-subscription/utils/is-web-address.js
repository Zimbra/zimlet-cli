// Accepts only addresses that start with http:// or https://.
export function isWebAddress(value) {
	try {
		const { protocol } = new URL(value);
		return protocol === 'http:' || protocol === 'https:';
	} catch (error) {
		return false;
	}
}
