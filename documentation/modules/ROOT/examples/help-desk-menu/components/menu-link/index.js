import { createElement } from 'preact';
import { Text } from '@zimbra/preact-i18n';
import { ActionMenuItem } from '@zimbra-client/components';
import { withIntl } from '../../enhancers';

// A menu item that opens a page of your own in a new tab.
const MenuLink = ({ url, icon, labelId }) => (
	<ActionMenuItem href={url} icon={icon} isExternal>
		<Text id={labelId} />
	</ActionMenuItem>
);

export default withIntl()(MenuLink);
