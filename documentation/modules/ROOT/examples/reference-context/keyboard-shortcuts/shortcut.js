export default function Zimlet(context) {
	const { keyBindings, shortcutCommandHandler } = context;

	const handlers = [
		{ context: 'all', command: 'MY_ZIMLET_HELLO', handler: () => console.warn('Hello') }
	];

	return {
		init() {
			// Press Y, then H, to run the command.
			keyBindings.addBindings({ all: { Y: { H: 'MY_ZIMLET_HELLO' } } });
			shortcutCommandHandler.addCommandHandlers(handlers);
		}
	};
}
