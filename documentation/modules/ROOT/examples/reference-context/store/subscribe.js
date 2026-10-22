export default function Zimlet(context) {
	const { store } = context;

	return {
		init() {
			const unsubscribe = store.subscribe(() => {
				const { account } = store.getState().email;
				if (account) {
					console.warn('Account loaded:', account.name);
					unsubscribe();
				}
			});
		}
	};
}
