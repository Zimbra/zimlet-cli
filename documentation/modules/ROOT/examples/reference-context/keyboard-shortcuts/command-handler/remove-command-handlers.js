export default function Zimlet(context) {
	const { keyBindings, shortcutCommandHandler } = context;

	const entry = {
		context: 'all',
		command: 'MY_ZIMLET_ONCE',
		handler: () => {
			console.warn('Once');
			shortcutCommandHandler.removeCommandHandlers([entry]);
		}
	};

	return {
		init() {
			keyBindings.addBindings({ all: { Y: { O: 'MY_ZIMLET_ONCE' } } });
			shortcutCommandHandler.addCommandHandlers([entry]);
		}
	};
}
