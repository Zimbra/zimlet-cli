import { createElement } from 'preact';
import MeetingLinkButton from './components/meeting-link-button';

export default function Zimlet(context) {
	const { plugins } = context;

	return {
		init() {
			plugins.register(
				'slot::calendar-appointment-edit-video-call',
				({ locations, handleLocationChange }) => (
					<MeetingLinkButton locations={locations} handleLocationChange={handleLocationChange} />
				)
			);
		}
	};
}
