export default function Zimlet(context) {
	const { zimletRedux } = context.store;

	return {
		init() {
			zimletRedux.addActions('myZimlet', { ping: () => ({ type: 'MY_ZIMLET_PING' }) });
			zimletRedux.removeActions('myZimlet');
			console.warn('Still published:', 'myZimlet' in zimletRedux.actions);
		}
	};
}
