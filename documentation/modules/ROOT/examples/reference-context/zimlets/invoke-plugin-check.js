export default function Zimlet(context) {
	const { plugins } = context;

	return {
		init() {
			// A check returns a problem as text, or nothing when the message is fine.
			plugins.register('my-checks.before-send', message =>
				message.subject ? null : 'The subject is empty'
			);
		}
	};
}
