export default function Zimlet(context) {
	const { store } = context;
	const { zimletRedux } = store;

	return {
		init() {
			zimletRedux.addActions('myZimlet', { ping: () => ({ type: 'MY_ZIMLET_PING' }) });
			store.dispatch(zimletRedux.actions.myZimlet.ping());
		}
	};
}
