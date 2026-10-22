import { createElement } from 'preact';
import { Text } from '@zimbra/preact-i18n';
import { withIntl } from '../../enhancers';
import { useNow } from '../../hooks/use-now';
import { HEAD_OFFICE_TIME_ZONE, REFRESH_INTERVAL_MS } from '../../constants';
import style from './style.less';

// An undefined locale uses the language of the browser.
const timeFormat = new Intl.DateTimeFormat(undefined, {
	timeZone: HEAD_OFFICE_TIME_ZONE,
	hour: '2-digit',
	minute: '2-digit'
});
const dateFormat = new Intl.DateTimeFormat(undefined, {
	timeZone: HEAD_OFFICE_TIME_ZONE,
	weekday: 'long',
	day: 'numeric',
	month: 'long'
});

const HeadOfficeClock = () => {
	const now = useNow(REFRESH_INTERVAL_MS);

	return (
		<div class={style.clock}>
			<p class={style.label}>
				<Text id="my-zimlet.label" />
			</p>
			<p class={style.time}>{timeFormat.format(now)}</p>
			<p class={style.date}>{dateFormat.format(now)}</p>
		</div>
	);
};

export default withIntl()(HeadOfficeClock);
