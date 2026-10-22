const MESSAGE = 'Hello from my Zimlet';

export default function Zimlet(context) {
	const { store } = context;
	const { notifications } = store.zimletRedux.actions;

	return {
		init() {
			// notify() builds the action, and dispatch() sends it to the store.
			store.dispatch(notifications.notify({ message: MESSAGE }));
		}
	};
}
