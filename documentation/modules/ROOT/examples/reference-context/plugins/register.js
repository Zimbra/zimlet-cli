import { createElement } from 'preact';

export default function Zimlet(context) {
	const { plugins } = context;

	const Divider = () => <hr />;

	return {
		init() {
			plugins.register('slot::message-body-top', Divider);
		}
	};
}
