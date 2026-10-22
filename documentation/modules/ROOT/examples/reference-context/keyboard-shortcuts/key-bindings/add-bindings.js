export default function Zimlet(context) {
	const { keyBindings } = context;

	return {
		init() {
			keyBindings.addBindings({ all: { 'ctrl+shift+H': 'MY_ZIMLET_HELP' } });
			const { commands } = keyBindings.getCommandsAndSequences('ctrl+shift+H');
			console.warn('Commands for the key:', commands);
		}
	};
}
