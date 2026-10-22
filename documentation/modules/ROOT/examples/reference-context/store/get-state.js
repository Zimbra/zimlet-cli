export default function Zimlet(context) {
	const { store } = context;

	return {
		init() {
			const { account } = store.getState().email;
			console.warn('Signed in as', account?.name);
		}
	};
}
