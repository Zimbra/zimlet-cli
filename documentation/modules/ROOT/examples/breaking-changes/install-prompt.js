import { awaitInstallPrompt, isStandalone } from '@zimbra-client/pwa-utils';

// Use localization for visible text in a real Zimlet.
const MESSAGE = 'Install the app for quicker access';
const INSTALL_LABEL = 'Install';

export default function Zimlet(context) {
	const { store } = context;
	const { notify } = store.zimletRedux.actions.notifications;

	return {
		init() {
			if (isStandalone()) {
				return;
			}

			// The browser can offer the install dialog once. The callback gets a function that opens it.
			awaitInstallPrompt(showInstallDialog => {
				if (!showInstallDialog) {
					return;
				}

				store.dispatch(
					notify({
						message: MESSAGE,
						action: { label: INSTALL_LABEL, fn: showInstallDialog },
						duration: 10000
					})
				);
			});
		}
	};
}
