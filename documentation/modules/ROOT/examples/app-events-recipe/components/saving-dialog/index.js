import { createElement } from 'preact';
import { Text } from '@zimbra/preact-i18n';
import { Spinner } from '@zimbra-client/blocks';
import { ModalDialog } from '@zimbra-client/components';
import { withIntl } from '../../enhancers';
import style from './style.less';

const SavingDialog = () => (
	<ModalDialog
		title={<Text id="my-zimlet.savingTitle" />}
		footer={false}
		hideClose
		disableEscape
		disableOutsideClick
	>
		<div class={style.content}>
			<Spinner />
			<Text id="my-zimlet.savingDescription" />
		</div>
	</ModalDialog>
);

export default withIntl()(SavingDialog);
