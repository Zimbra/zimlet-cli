import { createElement } from 'preact';
import { useCallback } from 'preact/hooks';
import { ActionMenuItem } from '@zimbra-client/components';
import { Rows3Icon } from 'lucide-preact';

const LABEL = 'Compact view';

// This Zimlet owns the choice. Other Zimlets learn about it only through the event.
let compact = false;

function CompactViewItem({ zimlets }) {
	const onToggle = useCallback(() => {
		compact = !compact;
		zimlets.emit('my-sender.compact-changed', { compact });
	}, [zimlets]);

	return (
		<ActionMenuItem icon={Rows3Icon} onClick={onToggle}>
			{LABEL}
		</ActionMenuItem>
	);
}

export default function Zimlet(context) {
	const { plugins, zimlets } = context;

	return {
		init() {
			plugins.register('slot::gear-menu', () => <CompactViewItem zimlets={zimlets} />);
		}
	};
}
