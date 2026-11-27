import { getCspNonce } from '@zimbra-client/util';

// Placeholder address of a script that your Zimlet loads from another host.
const SDK_URL = 'https://zimbra.github.io/zimlet-cli/<sdk-path>/sdk.js';

export default function Zimlet() {
	return {
		init() {
			const script = document.createElement('script');
			script.src = SDK_URL;

			// The nonce is null when the Modern UI runs without a Content Security Policy.
			const nonce = getCspNonce();
			if (nonce) {
				script.setAttribute('nonce', nonce);
			}

			window.parent.document.head.appendChild(script);
		}
	};
}
