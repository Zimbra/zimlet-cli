import { createElement } from 'preact';
import VipButton from '../vip-button';
import VipMark from '../vip-mark';
import style from './style.less';

// The row of the contact details: the star of a VIP, then the link that changes the list.
const VipDetails = ({ zimbraBatchClient, notify, email }) => (
	<div class={style.row}>
		<VipMark email={email} />
		<VipButton zimbraBatchClient={zimbraBatchClient} notify={notify} email={email} />
	</div>
);

export default VipDetails;
