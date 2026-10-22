// Use localization for visible text in a real Zimlet.
const MESSAGE = 'The sync takes longer than usual';

export default function Zimlet(context) {
	const { store } = context;
	const { notifications } = store.zimletRedux.actions;

	return {
		init() {
			// A warning that stays for ten seconds instead of the default six.
			store.dispatch(notifications.notify({ message: MESSAGE, warning: true, duration: 10000 }));
		}
	};
}
