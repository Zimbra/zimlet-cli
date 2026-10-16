import { createElement } from 'preact';
import AccountName from './components/AccountName';

export default function Zimlet(context) {
	const { plugins } = context;

	return {
		init() {
			plugins.register('slot::message-body-top', () => <AccountName />);
		}
	};
}
