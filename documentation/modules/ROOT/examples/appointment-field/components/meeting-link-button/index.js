import { createElement } from 'preact';
import { useCallback } from 'preact/hooks';
import { Text } from '@zimbra/preact-i18n';
import { Button } from '@zimbra-client/blocks';
import { withIntl } from '../../enhancers';
import { addMeetingLink, findMeetingLink, removeMeetingLink } from '../../utils/meeting-link';

// A link-style button that adds a meeting link to the location of the appointment, or removes it.
const MeetingLinkButton = ({ locations, handleLocationChange }) => {
	const hasLink = Boolean(findMeetingLink(locations));

	const handleClick = useCallback(
		() =>
			handleLocationChange({
				value: hasLink ? removeMeetingLink(locations) : addMeetingLink(locations)
			}),
		[handleLocationChange, hasLink, locations]
	);

	return (
		<Button styleType="text" alignLeft onClick={handleClick}>
			<Text id={`my-zimlet.meetingLink.${hasLink ? 'remove' : 'add'}`} />
		</Button>
	);
};

export default withIntl()(MeetingLinkButton);
