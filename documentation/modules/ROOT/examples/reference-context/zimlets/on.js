import { createElement } from 'preact';
import { ActionMenuItem } from '@zimbra-client/components';
import { PuzzleIcon } from 'lucide-preact';

const HUB_KEY = 'my-hub.items';
const GEAR_MENU = 'slot::gear-menu';
const LABEL = 'Extensions';

const ExtensionsItem = () => <ActionMenuItem icon={PuzzleIcon}>{LABEL}</ActionMenuItem>;

export default function Zimlet(context) {
	const { plugins, zimlets } = context;
	let shown = false;

	// Other Zimlets add items under HUB_KEY. Show the menu item only while there is one.
	const syncMenuItem = changedKey => {
		if (changedKey !== HUB_KEY) {
			return;
		}

		const hasItems = zimlets.isSlotActive(HUB_KEY);

		if (hasItems && !shown) {
			plugins.register(GEAR_MENU, ExtensionsItem);
			shown = true;
		} else if (!hasItems && shown) {
			plugins.unregister(GEAR_MENU, ExtensionsItem);
			shown = false;
		}
	};

	return {
		init() {
			zimlets.on('plugins::changed', syncMenuItem);
		}
	};
}
