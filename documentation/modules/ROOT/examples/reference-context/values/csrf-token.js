export default function Zimlet(context) {
	const { zimbraOrigin, csrfToken } = context;

	return {
		init() {
			fetch(zimbraOrigin + '/<your-endpoint>', {
				method: 'POST',
				credentials: 'include',
				headers: { 'X-Zimbra-Csrf-Token': csrfToken }
			}).catch(error => console.error('Request failed', error));
		}
	};
}
