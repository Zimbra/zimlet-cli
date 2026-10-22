export default function Zimlet(context) {
	const { keyBindings, shortcutCommandHandler } = context;

	return {
		init() {
			keyBindings.addBindings({ mail: { Y: { M: 'MY_ZIMLET_MARK' } } });
			shortcutCommandHandler.addCommandHandlers([
				{ context: 'mail', command: 'MY_ZIMLET_MARK', handler: ({ e }) => console.warn(e.key) }
			]);
		}
	};
}
