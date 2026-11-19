import { createElement } from 'preact';
import { Text } from '@zimbra/preact-i18n';
import { Button, Icon } from '@zimbra-client/blocks';
import { ExternalLinkIcon, ShieldCheckIcon } from 'lucide-preact';
import { POLICY_URL } from '../../constants';
import { withIntl } from '../../enhancers';
import style from './style.less';

// A short notice for the ad box. The box is 300 px wide and cuts off content above 250 px.
const PolicyNotice = () => (
	<section class={style.notice}>
		<h2 class={style.title}>
			<Icon name={ShieldCheckIcon} size="sm" aria-hidden="true" />
			<Text id="my-zimlet.title" />
		</h2>
		<p class={style.text}>
			<Text id="my-zimlet.text" />
		</p>
		<Button
			styleType="text"
			alignLeft
			href={POLICY_URL}
			useAnchor
			target="_blank"
			rel="noopener noreferrer"
			icon={ExternalLinkIcon}
			iconPosition="right"
			iconSize="xs"
		>
			<Text id="my-zimlet.readPolicy" />
		</Button>
	</section>
);

export default withIntl()(PolicyNotice);
