export default function Zimlet(context) {
	const { zimlets } = context;

	return {
		init() {
			zimlets.on('my-sender.compact-changed', ({ compact }) => {
				console.warn('Compact view is', compact ? 'on' : 'off');
			});
		}
	};
}
