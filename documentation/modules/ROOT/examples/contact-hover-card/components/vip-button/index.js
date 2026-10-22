import { createElement } from 'preact';
import { Text } from '@zimbra/preact-i18n';
import { Button } from '@zimbra-client/blocks';
import { withIntl } from '../../enhancers';
import useToggleVip from '../../hooks/use-toggle-vip';

// A link-style button for the card that opens over an address.
const VipButton = ({ zimbraBatchClient, notify, email }) => {
	const { isVip, canToggle, toggle } = useToggleVip(zimbraBatchClient, notify, email);

	return (
		<Button styleType="text" alignLeft disabled={!canToggle} onClick={toggle}>
			<Text id={isVip ? 'my-zimlet.remove' : 'my-zimlet.add'} />
		</Button>
	);
};

export default withIntl()(VipButton);
