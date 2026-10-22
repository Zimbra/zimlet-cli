export default function Zimlet(context) {
	const { zimlets } = context;
	const slot = 'slot::message-body-top';

	// Runs each time a handler is added or removed. The data is the key that changed.
	const onPluginsChanged = key => {
		if (key === slot && zimlets.isSlotActive(slot)) {
			console.warn('A handler now uses', slot);
			zimlets.off('plugins::changed', onPluginsChanged);
		}
	};

	return {
		init() {
			zimlets.on('plugins::changed', onPluginsChanged);
		}
	};
}
