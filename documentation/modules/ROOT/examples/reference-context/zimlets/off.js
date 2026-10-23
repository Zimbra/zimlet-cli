export default function Zimlet(context) {
	const { zimlets } = context;

	return {
		init() {
			const onReady = data => {
				console.warn('Ready:', data);
				zimlets.off('my-zimlet.ready', onReady);
			};

			zimlets.on('my-zimlet.ready', onReady);
			zimlets.emit('my-zimlet.ready', { round: 1 });
			zimlets.emit('my-zimlet.ready', { round: 2 });
		}
	};
}
