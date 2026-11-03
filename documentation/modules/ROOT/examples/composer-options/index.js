import { createElement } from 'preact';
import ConfidentialityOptions from './components/confidentiality-options';

export default function Zimlet(context) {
	const { plugins } = context;

	return {
		init() {
			// The menu of the sender options in the composer. The slot passes functions that read and
			// change the message that is being written, and `isPlainText`.
			plugins.register(
				'slot::compose-sender-options-menu',
				({ insertAtCaret, isPlainText, getSubject, setSubject }) => (
					<ConfidentialityOptions
						insertAtCaret={insertAtCaret}
						isPlainText={isPlainText}
						getSubject={getSubject}
						setSubject={setSubject}
					/>
				)
			);
		}
	};
}
