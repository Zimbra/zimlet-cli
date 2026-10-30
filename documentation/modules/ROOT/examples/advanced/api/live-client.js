// Placeholder address. Replace it with the address of your service.
const STATUS_URL = 'https://zimbra.github.io/zimlet-cli/api/status';

// Reads the status through the Zimbra server proxy, with the session of the signed-in user.
export function getStatus(zimbraOrigin) {
	const target = encodeURIComponent(STATUS_URL);

	return fetch(`${zimbraOrigin}/service/proxy?target=${target}`, { credentials: 'include' })
		.then(response => {
			if (!response.ok) {
				throw new Error(`${response.status} ${response.statusText}`);
			}
			return response.json();
		})
		.then(data => data.status);
}
