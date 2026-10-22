export default function Zimlet(context) {
	const { store } = context;
	const { zimletRedux } = store;

	return {
		init() {
			zimletRedux.addSelectors('myZimlet', { accountName: state => state.email.account?.name });
			const name = zimletRedux.selectors.myZimlet.accountName(store.getState());
			console.warn('Account name:', name);
		}
	};
}
