import { createElement } from 'preact';
import { Text } from '@zimbra/preact-i18n';
import { withIntl } from '../../enhancers';

// A line in the list of the standard Video start page. The slot sits in a bulleted list.
const MeetingsLandingItem = () => (
	<li>
		<Text id="my-zimlet.landingItem" />
	</li>
);

export default withIntl()(MeetingsLandingItem);
