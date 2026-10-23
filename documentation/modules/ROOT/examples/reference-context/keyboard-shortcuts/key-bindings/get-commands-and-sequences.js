export default function Zimlet(context) {
	const { keyBindings } = context;

	return {
		init() {
			const { commands, sequences } = keyBindings.getCommandsAndSequences('G');
			console.warn('Commands:', commands.length, 'Sequences:', sequences.length);
		}
	};
}
