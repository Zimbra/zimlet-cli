export default function Zimlet(context) {
	const { shortcutCommandHandler } = context;

	return {
		init() {
			const shortcuts = shortcutCommandHandler.getShortcuts();
			console.warn('Contexts with working shortcuts:', Object.keys(shortcuts));
		}
	};
}
