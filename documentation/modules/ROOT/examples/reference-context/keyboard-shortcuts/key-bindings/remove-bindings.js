export default function Zimlet(context) {
	const { keyBindings } = context;

	return {
		init() {
			keyBindings.removeBindings(['all.N.C']);
			console.warn('Left for N:', keyBindings.getBindings().all.N);
		}
	};
}
