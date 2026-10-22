import { createElement } from 'preact';
import { useEffect, useRef, useState } from 'preact/hooks';
import { Text } from '@zimbra/preact-i18n';
import { withIntl } from '../../enhancers';
import { useAway } from '../../hooks/use-away';
import { SHOW_COMMAND } from '../../constants';
import style from './style.less';

const PrivacyBlur = ({ shortcutCommandHandler }) => {
	const away = useAway();
	const [hidden, setHidden] = useState(false);
	const overlay = useRef(null);

	// The screen stays hidden after the user returns, until the user shows it.
	useEffect(() => {
		if (away) {
			setHidden(true);
		}
	}, [away]);

	useEffect(() => {
		if (!hidden) {
			return undefined;
		}
		// Take the focus, so that keys do not reach the page below and a text field there
		// cannot swallow the shortcut.
		overlay.current?.focus();

		// Add the handler only while the screen is hidden, so the shortcut is not listed the rest of the time.
		// Keep the objects in a variable, so that the cleanup removes the same handler.
		const handlers = [{ context: 'all', command: SHOW_COMMAND, handler: () => setHidden(false) }];
		shortcutCommandHandler.addCommandHandlers(handlers);
		return () => shortcutCommandHandler.removeCommandHandlers(handlers);
	}, [hidden, shortcutCommandHandler]);

	if (!hidden) {
		return null;
	}

	return (
		<div ref={overlay} class={style.overlay} tabIndex={-1}>
			<p>
				<Text id="my-zimlet.hidden" />
			</p>
			<p>
				<Text id="my-zimlet.showHint" />
			</p>
		</div>
	);
};

export default withIntl()(PrivacyBlur);
