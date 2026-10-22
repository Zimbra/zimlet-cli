import { createElement } from 'preact';
import Today from './components/today';

export default function Zimlet(context) {
	const { plugins } = context;

	return {
		init() {
			plugins.register('slot::mail-sidebar-footer', () => <Today />);
		}
	};
}
