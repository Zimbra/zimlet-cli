import { createElement } from 'preact';
import { useText } from '@zimbra/preact-i18n';
import { StarIcon } from 'lucide-preact';
import { Icon } from '@zimbra-client/blocks';
import { withIntl } from '../../enhancers';
import useIsVip from '../../hooks/use-is-vip';
import style from './style.less';

// A star that the slot shows next to the address of a VIP.
const VipMark = ({ email }) => {
	const isVip = useIsVip(email);
	const { label } = useText({ label: 'my-zimlet.vip' });

	return isVip ? (
		<span class={style.mark} role="img" aria-label={label} title={label}>
			<Icon name={StarIcon} size="sm" fill="currentColor" />
		</span>
	) : null;
};

export default withIntl()(VipMark);
