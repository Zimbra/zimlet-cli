import { createElement } from 'preact';

// Use localization for visible text in a real Zimlet.
const WELCOME_LABEL = 'Welcome';

export default function Zimlet(context) {
	const { plugins, zimbraBatchClient } = context;

	return {
		init() {
			// init() returns at once. The handler is registered when the lookup finishes.
			zimbraBatchClient
				.jsonRequest({
					name: 'GetInfo',
					namespace: 'urn:zimbraAccount',
					body: { sections: 'attrs' }
				})
				.then(({ name }) => {
					plugins.register('slot::mail-sidebar-footer', () => <p>{`${WELCOME_LABEL}, ${name}`}</p>);
				})
				.catch(error => {
					console.error('Could not look up the account', error);
				});
		}
	};
}
