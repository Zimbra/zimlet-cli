import { createElement } from 'preact';
import { Text } from '@zimbra/preact-i18n';
import { ActionButton } from '@zimbra-client/components';
import { ShieldCheckIcon } from 'lucide-preact';
import { withIntl } from '../../enhancers';
import useSharingCheck from '../../hooks/use-sharing-check';

// A button for the toolbar above the list of files.
const CheckButton = ({ addModal, removeModal, selectedList }) => {
	const { hasFiles, runCheck } = useSharingCheck(addModal, removeModal, selectedList);

	return (
		<ActionButton icon={ShieldCheckIcon} disabled={!hasFiles} onClick={runCheck}>
			<Text id="my-zimlet.check" />
		</ActionButton>
	);
};

export default withIntl()(CheckButton);
