import { createElement } from 'preact';
import Meter from './components/Meter';

export default function Zimlet(context) {
	const { plugins } = context;

	return {
		init() {
			plugins.register('slot::mail-sidebar-footer', () => <Meter value={85} />);
		}
	};
}
