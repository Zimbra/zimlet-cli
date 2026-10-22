import { createElement } from 'preact';
import { Text } from '@zimbra/preact-i18n';
import { withIntl } from '../../enhancers';

const Greeting = () => (
	<p>
		<Text id="my-zimlet.greeting" />
	</p>
);

export default withIntl()(Greeting);
