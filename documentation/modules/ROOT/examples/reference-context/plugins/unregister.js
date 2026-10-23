import { createElement } from 'preact';

const VISIBLE_MS = 10000;

export default function Zimlet(context) {
	const { plugins } = context;

	// Keep the function in a variable: unregister() needs the same function.
	const Divider = () => <hr />;

	return {
		init() {
			plugins.register('slot::message-body-top', Divider);

			// Remove the divider after ten seconds.
			setTimeout(() => plugins.unregister('slot::message-body-top', Divider), VISIBLE_MS);
		}
	};
}
