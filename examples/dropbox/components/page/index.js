import { Component } from 'preact';
import style from './style.less';

export default class Page extends Component {

	componentWillMount() {
		this.shortcutHandlers = [
			{ context: 'dropbox', command: 'DROPBOX_ALERT', handler: () => window.alert('You hit ctrl+A') } //eslint-disable-line no-alert
		];

		this.context.shortcutCommandHandler.addCommandHandlers(this.shortcutHandlers);
	}

	componentDidMount() {
		console.log('dropbox mount');
	}

	componentWillUnmount() {
		this.context.shortcutCommandHandler.removeCommandHandlers(this.shortcutHandlers);
		console.log('dropbox unmount');
	}

	render() {
		return (
			<div class={style.page}>
				<h2>Dropbox</h2>
				<p>I am some content</p>

				<h2>Keyboard Shortcuts</h2>
				<p>
					This zimlet adds two keyboard shortcuts:
				</p>
				<p><pre style="display: inline-block">G D</pre>: Open the Dropbox Tab (added globally)</p>
				<p><pre style="display: inline-block">ctrl+A</pre>: Show an alert.  Only active when the Dropbox tab is open</p>
			</div>
		);
	}
}

