import { createElement } from 'preact';

function Greeting() {
	return <p>Hello from my Zimlet</p>;
}

export default function Zimlet(context) {
	const { plugins } = context;

	return {
		init() {
			plugins.register('slot::message-body-top', () => <Greeting />);
		}
	};
}
