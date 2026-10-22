import { createElement } from 'preact';
import { Text } from '@zimbra/preact-i18n';
import { MenuItem } from '@zimbra-client/components';
import { VideoIcon } from 'lucide-preact';
import { withIntl } from '../../enhancers';
import useMeetingsPath from '../../hooks/use-meetings-path';

// The tab in the Video area that opens the meeting rooms screen.
const MeetingsTabItem = () => {
	const path = useMeetingsPath();

	return (
		<MenuItem icon={VideoIcon} href={path}>
			<Text id="my-zimlet.tabTitle" />
		</MenuItem>
	);
};

export default withIntl()(MeetingsTabItem);
