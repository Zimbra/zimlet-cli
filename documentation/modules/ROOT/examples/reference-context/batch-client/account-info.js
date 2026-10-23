export default function Zimlet(context) {
	const { zimbraBatchClient } = context;

	return {
		init() {
			zimbraBatchClient
				.accountInfo()
				.then(({ name }) => console.warn('Signed in as', name))
				.catch(error => console.error('Could not read the account', error));
		}
	};
}
