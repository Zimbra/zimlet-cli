import { createElement } from 'preact';
import ExternalSenderBanner from './components/external-sender-banner';

export default function Zimlet(context) {
	const { plugins } = context;

	return {
		init() {
			// The slot above the text of a message. It passes `emailData`, `viewerRef` and
			// `htmlUpdated`, which the banner reads.
			plugins.register('slot::message-body-top', ({ emailData, viewerRef, htmlUpdated }) => (
				<ExternalSenderBanner
					emailData={emailData}
					viewerRef={viewerRef}
					htmlUpdated={htmlUpdated}
				/>
			));
		}
	};
}
