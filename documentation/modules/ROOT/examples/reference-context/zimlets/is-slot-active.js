import { createElement } from 'preact';

const SLOT = 'slot::email-landing-page-description';
const TIP = 'Press / to search your mail';

const Tip = () => <li>{TIP}</li>;

export default function Zimlet(context) {
	const { plugins, zimlets } = context;
	let added = false;

	return {
		init() {
			// Wait until the Zimlets have registered, then add a tip only if no Zimlet has added one.
			zimlets.on('zimlets-initialized', () => {
				if (!added && !zimlets.isSlotActive(SLOT)) {
					added = true;
					plugins.register(SLOT, Tip);
				}
			});
		}
	};
}
