import { createElement } from 'preact';
import { useCallback } from 'preact/hooks';
import { Text } from '@zimbra/preact-i18n';
import { ActionMenuItem } from '@zimbra-client/components';
import { withIntl } from '../../enhancers';
import useExportEvent from '../../hooks/use-export-event';

// A menu item that downloads the event of the menu as an .ics file.
const ExportEventItem = ({ zimbraBatchClient, eventToDisplay }) => {
	const exportEvent = useExportEvent(zimbraBatchClient);
	const handleClick = useCallback(() => exportEvent(eventToDisplay), [exportEvent, eventToDisplay]);

	return (
		<ActionMenuItem nonOfflineDesktopFeature onClick={handleClick}>
			<Text id="my-zimlet.exportEvent.menuItem" />
		</ActionMenuItem>
	);
};

export default withIntl()(ExportEventItem);
