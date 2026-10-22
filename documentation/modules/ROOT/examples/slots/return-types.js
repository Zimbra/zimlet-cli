import { createElement } from 'preact';

// Use localization for visible text in a real Zimlet.
const ELEMENT_LABEL = 'A function that returns an element';
const VALUE_LABEL = 'An element that is not in a function';
const TEXT_VALUE = 'A text value';

const VALUE_ELEMENT = <p>{VALUE_LABEL}</p>;

function Badge({ emailData }) {
	return <p>{emailData.subject}</p>;
}

export default function Zimlet(context) {
	const { plugins } = context;

	return {
		init() {
			// A function that returns an element: the slot shows the element.
			plugins.register('slot::message-body-top', () => <p>{ELEMENT_LABEL}</p>);

			// A function that returns a component: the slot renders it with the props of the slot.
			plugins.register('slot::message-body-top', () => Badge);

			// A value that is not a function is used as it is.
			plugins.register('slot::message-body-top', VALUE_ELEMENT);
			plugins.register('slot::message-body-top', TEXT_VALUE);
		}
	};
}
