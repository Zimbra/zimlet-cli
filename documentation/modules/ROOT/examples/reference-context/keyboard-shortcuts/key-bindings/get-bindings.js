export default function Zimlet(context) {
	const { keyBindings } = context;

	return {
		init() {
			console.warn('Contexts with shortcuts:', Object.keys(keyBindings.getBindings()));
		}
	};
}
