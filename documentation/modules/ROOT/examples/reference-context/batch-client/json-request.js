export default function Zimlet(context) {
	const { zimbraBatchClient } = context;

	return {
		init() {
			zimbraBatchClient
				.jsonRequest({ name: 'NoOp', body: {} })
				.then(() => console.warn('The session is valid'))
				.catch(error => console.error('The session check failed', error));
		}
	};
}
