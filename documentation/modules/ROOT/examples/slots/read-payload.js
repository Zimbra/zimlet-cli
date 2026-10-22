import { createElement } from 'preact';

// Use localization for visible text in a real Zimlet.
const SUBJECT_LABEL = 'Subject';

export default function Zimlet(context) {
	const { plugins } = context;

	return {
		init() {
			// The slot passes emailData, the message that is open. Take only the props you need.
			plugins.register('slot::message-body-top', ({ emailData }) => (
				<p>{`${SUBJECT_LABEL}: ${emailData.subject}`}</p>
			));
		}
	};
}
