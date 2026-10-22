import { createElement } from 'preact';
import { Text } from '@zimbra/preact-i18n';
import { ModalDialog } from '@zimbra-client/components';
import { MAX_SIZE_MB } from '../../constants';
import { withIntl } from '../../enhancers';
import style from './style.less';

// Lists each checked file with its result.
const CheckResultDialog = ({ results, onClose }) => (
	<ModalDialog
		scrollable
		cancelButton={false}
		title={<Text id="my-zimlet.dialogTitle" />}
		onAction={onClose}
		onClose={onClose}
	>
		<ul class={style.results}>
			{results.map(({ id, name, problem }) => (
				<li key={id} class={style.result}>
					<span class={style.name}>{name}</span>
					<span class={problem ? style.problem : style.ready}>
						<Text id={`my-zimlet.${problem || 'ready'}`} fields={{ limit: MAX_SIZE_MB }} />
					</span>
				</li>
			))}
		</ul>
	</ModalDialog>
);

export default withIntl()(CheckResultDialog);
