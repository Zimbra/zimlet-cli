import { createElement } from 'preact';
import { Text } from '@zimbra/preact-i18n';
import { withIntl } from '../../enhancers';
import style from './style.less';

// Replaces the sender names of the row. The slot draws nothing else, so it shows the names too.
const PartnerSender = ({ emailAddresses }) => (
	<span class={style.sender}>
		<span class={style.names}>{emailAddresses.join(', ')}</span>
		<span class={style.badge}>
			<Text id="my-zimlet.partner" />
		</span>
	</span>
);

export default withIntl()(PartnerSender);
