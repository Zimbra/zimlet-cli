export default function Zimlet(context) {
	const { keyBindings } = context;

	return {
		init() {
			const bindings = keyBindings.getBindings();
			const all = { ...bindings.all, 'ctrl+K': 'FOCUS_SEARCH_BOX' };

			keyBindings.replaceBindings({ ...bindings, all });
		}
	};
}
