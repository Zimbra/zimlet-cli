export default function Zimlet(context) {
	const { store } = context;
	const { notifications } = store.zimletRedux.actions;

	return {
		init() {
			store.dispatch(notifications.clear());
		}
	};
}
