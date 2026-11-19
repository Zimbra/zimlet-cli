import { createElement } from 'preact';
import { useCallback, useState } from 'preact/hooks';
import { Icon } from '@zimbra-client/blocks';
import { FolderListGroup } from '@zimbra-client/components';
import { ExternalLinkIcon } from 'lucide-preact';
import { PARTNERS } from '../../constants';
import { withIntl } from '../../enhancers';
import style from './style.less';

// A group of partner shortcuts that opens and closes like the groups of the folder list.
const PartnerFolderGroup = () => {
	const [collapsed, setCollapsed] = useState(false);

	// The group does not open or close by itself. It reports the click and waits for `collapsed`.
	const handleToggle = useCallback(() => setCollapsed(value => !value), []);

	return (
		<FolderListGroup name="my-zimlet.partners" collapsed={collapsed} onToggle={handleToggle}>
			<ul class={style.list}>
				{PARTNERS.map(({ name, url }) => (
					<li key={url}>
						<a class={style.link} href={url} target="_blank" rel="noopener noreferrer">
							<span>{name}</span>
							<Icon name={ExternalLinkIcon} size="xs" aria-hidden="true" />
						</a>
					</li>
				))}
			</ul>
		</FolderListGroup>
	);
};

export default withIntl()(PartnerFolderGroup);
