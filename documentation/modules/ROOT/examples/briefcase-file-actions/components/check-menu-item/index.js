import { createElement } from 'preact';
import { Text } from '@zimbra/preact-i18n';
import { ActionMenuItem } from '@zimbra-client/components';
import { withIntl } from '../../enhancers';
import useSharingCheck from '../../hooks/use-sharing-check';

// An item for the context menu of a file.
const CheckMenuItem = ({ addModal, removeModal, selectedList }) => {
	const { hasFiles, runCheck } = useSharingCheck(addModal, removeModal, selectedList);

	return (
		<ActionMenuItem disabled={!hasFiles} onClick={runCheck}>
			<Text id="my-zimlet.check" />
		</ActionMenuItem>
	);
};

export default withIntl()(CheckMenuItem);
