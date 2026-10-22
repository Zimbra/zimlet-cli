import { createElement } from 'preact';
import { Text } from '@zimbra/preact-i18n';
import { withIntl } from '../../enhancers';

const Reminder = ({ count }) => (
	<p>
		<Text id="my-zimlet.reminder" fields={{ count }} />
	</p>
);

export default withIntl()(Reminder);
