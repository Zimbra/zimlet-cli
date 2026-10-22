import { csrfStorage } from '@zimbra-client/util';

// Returns a function that sends one Zimbra SOAP request as JSON with the user's session.
export function createSoapRequest({ zimbraOrigin }) {
	return function soapRequest(name, namespace, content) {
		const csrfToken = csrfStorage.get();
		return fetch(`${zimbraOrigin}/service/soap/${name}Request`, {
			method: 'POST',
			credentials: 'include',
			headers: {
				'Content-Type': 'application/json',
				...(csrfToken && { 'X-Zimbra-Csrf-Token': csrfToken })
			},
			body: JSON.stringify({ Body: { [`${name}Request`]: { _jsns: namespace, ...content } } })
		})
			.then(response => {
				if (!response.ok) {
					throw new Error(`${response.status} ${response.statusText}`);
				}
				return response.json();
			})
			.then(({ Body }) => Body[`${name}Response`]);
	};
}
