import { createElement } from 'preact';
import { useCallback } from 'preact/hooks';
import { ActionMenuItem } from '@zimbra-client/components';
import { useItemActionMutation } from '@zimbra-client/hooks';

// Use localization for visible text in a real Zimlet.
const FLAG_LABEL = 'Flag';

const FlagMenuItem = ({ emailData }) => {
	const [itemAction] = useItemActionMutation();

	const handleClick = useCallback(
		() => itemAction({ variables: { id: emailData.id, op: 'flag' } }),
		[itemAction, emailData]
	);

	return (
		<ActionMenuItem onClick={handleClick} disabled={!emailData}>
			{FLAG_LABEL}
		</ActionMenuItem>
	);
};

export default function Zimlet(context) {
	const { plugins } = context;

	return {
		init() {
			plugins.register('slot::action-menu-mail-more', FlagMenuItem);
		}
	};
}
