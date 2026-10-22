import { createElement } from 'preact';
import { ActionMenuItem } from '@zimbra-client/components';
import { usePreferences } from '@zimbra-client/hooks';

// Use localization for visible text in a real Zimlet.
const TIPS_LABEL = 'Formatting tips';
const TIPS_URL = '<tips-page-url>';

const openTips = () => window.open(TIPS_URL, '_blank', 'noopener');

const FormattingTips = () => {
	const { data, loading } = usePreferences();

	if (loading || data?.getPreferences?.zimbraPrefComposeFormat !== 'html') {
		return null;
	}

	return <ActionMenuItem onClick={openTips}>{TIPS_LABEL}</ActionMenuItem>;
};

export default function Zimlet(context) {
	const { plugins } = context;

	return {
		init() {
			plugins.register('slot::settings-dropdown-item', FormattingTips);
		}
	};
}
