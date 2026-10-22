import { createElement } from 'preact';
import { Text } from '@zimbra/preact-i18n';
import { MenuItem } from '@zimbra-client/components';
import { UsersIcon } from 'lucide-preact';
import { withIntl } from '../../enhancers';
import usePartnersPath from '../../hooks/use-partners-path';

// The tab in the Contacts area that opens the partners screen.
const PartnersTabItem = () => {
	const path = usePartnersPath();

	return (
		<MenuItem icon={UsersIcon} href={path}>
			<Text id="my-zimlet.tabTitle" />
		</MenuItem>
	);
};

export default withIntl()(PartnersTabItem);
