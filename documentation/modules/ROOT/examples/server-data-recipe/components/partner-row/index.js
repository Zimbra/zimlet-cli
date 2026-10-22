import { createElement } from 'preact';
import { useCallback } from 'preact/hooks';
import { Text } from '@zimbra/preact-i18n';
import { ActionButton } from '@zimbra-client/components';
import { Trash2Icon } from 'lucide-preact';
import { withIntl } from '../../enhancers';
import style from './style.less';

// One partner in the list, with the button that removes it.
const PartnerRow = ({ partner, onRemove }) => {
	const remove = useCallback(() => onRemove(partner.id), [partner.id, onRemove]);
	const label = <Text id="my-zimlet.removePartner" fields={{ email: partner.email }} />;

	return (
		<li class={style.partner}>
			<span class={style.email}>{partner.email}</span>
			<ActionButton iconOnly icon={Trash2Icon} title={label} aria-label={label} onClick={remove} />
		</li>
	);
};

export default withIntl()(PartnerRow);
