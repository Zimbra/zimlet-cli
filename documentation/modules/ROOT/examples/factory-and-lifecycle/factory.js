import { createElement } from 'preact';

// Use localization for visible text in a real Zimlet.
const GREETING = 'Hello from my Zimlet';

// The Modern UI calls this function once and passes it the context.
export default function Zimlet(context) {
	const { plugins } = context;

	return {
		// The Modern UI calls init() after the factory returns.
		init() {
			plugins.register('slot::message-body-top', () => <p>{GREETING}</p>);
		}
	};
}
