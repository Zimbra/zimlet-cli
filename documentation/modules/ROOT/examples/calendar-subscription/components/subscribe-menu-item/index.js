import { createElement } from 'preact';
import { useCallback } from 'preact/hooks';
import { useDispatch } from 'react-redux';
import { Text } from '@zimbra/preact-i18n';
import { ActionMenuItem } from '@zimbra-client/components';
import { FLOW_ID } from '../../constants';
import { withIntl } from '../../enhancers';

// Opens the dialog by storing the flag that the Calendar passes to the dialog slot.
const SubscribeMenuItem = ({ addSlot }) => {
	const dispatch = useDispatch();

	const handleClick = useCallback(
		() => dispatch(addSlot({ id: FLOW_ID, flag: true })),
		[dispatch, addSlot]
	);

	return (
		<ActionMenuItem onClick={handleClick}>
			<Text id="my-zimlet.subscribe" />
		</ActionMenuItem>
	);
};

export default withIntl()(SubscribeMenuItem);
