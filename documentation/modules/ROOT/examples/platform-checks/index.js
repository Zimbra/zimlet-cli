import { createElement } from 'preact';
import { openExternalBrowser } from '@zimbra-client/browser';
import { getPlatformType, PLATFORM_TYPES } from '@zimbra-client/platform';

const DOCS_URL = 'https://zimbra.github.io/zimlet-cli';

// Use localization for visible text in a real Zimlet.
const WEB_LABEL = 'Open the documentation';
const APP_LABEL = 'Open the documentation in your browser';

const openDocs = () => openExternalBrowser(DOCS_URL);

const DocsButton = () => {
	const isWeb = getPlatformType() === PLATFORM_TYPES.WEB;

	return (
		<button type="button" onClick={openDocs}>
			{isWeb ? WEB_LABEL : APP_LABEL}
		</button>
	);
};

export default function Zimlet(context) {
	const { plugins } = context;

	return {
		init() {
			plugins.register('slot::mail-sidebar-footer', DocsButton);
		}
	};
}
