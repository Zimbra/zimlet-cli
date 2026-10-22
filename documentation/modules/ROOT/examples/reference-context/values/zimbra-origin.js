export default function Zimlet(context) {
	const { zimbraOrigin } = context;

	return {
		init() {
			fetch(zimbraOrigin + '/<your-endpoint>', { credentials: 'include' })
				.then(response => console.warn('Status:', response.status))
				.catch(error => console.error('Request failed', error));
		}
	};
}
