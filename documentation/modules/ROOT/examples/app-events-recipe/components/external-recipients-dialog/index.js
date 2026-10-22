import { createElement } from 'preact';
import { Text } from '@zimbra/preact-i18n';
import { ConfirmModalDialog } from '@zimbra-client/components';
import { withIntl } from '../../enhancers';
import style from './style.less';

const ExternalRecipientsDialog = ({ addresses, onResult }) => (
	<ConfirmModalDialog
		title={<Text id="my-zimlet.externalTitle" />}
		acceptText="my-zimlet.sendAnyway"
		rejectText="my-zimlet.dontSend"
		cancelButton={false}
		onResult={onResult}
	>
		<p>
			<Text id="my-zimlet.externalDescription" />
		</p>
		<ul class={style.addresses}>
			{addresses.map(address => (
				<li key={address}>{address}</li>
			))}
		</ul>
		<p>
			<Text id="my-zimlet.rememberHint" />
		</p>
	</ConfirmModalDialog>
);

export default withIntl()(ExternalRecipientsDialog);
