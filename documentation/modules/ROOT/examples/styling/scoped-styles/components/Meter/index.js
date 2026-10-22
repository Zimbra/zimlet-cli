import { createElement } from 'preact';
import style from './style.less';

// Use localization for visible text in a real Zimlet.
const METER_LABEL = 'Space used';

const WARNING_FROM = 80;

const Meter = ({ value }) => (
	<div class={value >= WARNING_FROM ? `${style.meter} ${style.warning}` : style.meter}>
		<span>{METER_LABEL}</span>
		<div class={style.track}>
			<div class={style.fill} style={{ '--used': `${value}%` }} />
		</div>
	</div>
);

export default Meter;
