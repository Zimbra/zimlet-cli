import { createElement } from 'preact';
import { useCallback } from 'preact/hooks';
import { Text } from '@zimbra/preact-i18n';
import { ActionMenuItem } from '@zimbra-client/components';
import { FlagIcon } from 'lucide-preact';
import { withIntl } from '../../enhancers';
import { REPORT_URL, REPORT_WINDOW_FEATURES } from '../../constants';

const ReportProblem = () => {
	// A link cannot size its window, so the item opens the form in a small window.
	const openForm = useCallback(() => {
		window.open(REPORT_URL, '_blank', REPORT_WINDOW_FEATURES);
	}, []);

	return (
		<ActionMenuItem icon={FlagIcon} onClick={openForm}>
			<Text id="my-zimlet.reportProblem" />
		</ActionMenuItem>
	);
};

export default withIntl()(ReportProblem);
