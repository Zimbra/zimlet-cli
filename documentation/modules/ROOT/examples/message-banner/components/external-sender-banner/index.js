import { createElement } from 'preact';
import { useCallback, useState } from 'preact/hooks';
import { Text } from '@zimbra/preact-i18n';
import { Button, Icon, WarningBanner } from '@zimbra-client/blocks';
import { NakedButton } from '@zimbra-client/components';
import { useAccountInfo } from '@zimbra-client/hooks/graphql';
import { ExternalLinkIcon, GlobeIcon } from 'lucide-preact';
import { SECURITY_TIPS_URL } from '../../constants';
import { withIntl } from '../../enhancers';
import { useLinkCount } from '../../hooks/use-link-count';
import { getDomain } from '../../utils/get-domain';
import style from './style.less';

const ExternalSenderBanner = ({ emailData, viewerRef, htmlUpdated }) => {
	const [dismissed, setDismissed] = useState(false);
	const { data } = useAccountInfo();
	const linkCount = useLinkCount(viewerRef, htmlUpdated);

	const handleDismiss = useCallback(() => setDismissed(true), []);

	const sender = emailData?.emailAddresses?.find(({ type }) => type === 'f');
	const senderDomain = getDomain(sender?.address);
	const ownDomain = getDomain(data?.accountInfo?.name);

	// Both domains are unknown until the message and the account have loaded.
	if (dismissed || !senderDomain || !ownDomain || senderDomain === ownDomain) {
		return null;
	}

	return (
		<WarningBanner>
			<Text id="my-zimlet.external" />
			<div class={style.row}>
				<span class={style.domain}>
					<Icon name={GlobeIcon} size="xs" aria-hidden="true" />
					<Text id="my-zimlet.sentFrom" fields={{ domain: senderDomain }} />
				</span>
				{linkCount > 0 && <Text id="my-zimlet.links" fields={{ count: linkCount }} />}
			</div>
			<div class={style.row}>
				<Button
					styleType="text"
					alignLeft
					href={SECURITY_TIPS_URL}
					useAnchor
					target="_blank"
					rel="noopener noreferrer"
					icon={ExternalLinkIcon}
					iconPosition="right"
					iconSize="xs"
				>
					<Text id="my-zimlet.tips" />
				</Button>
				<NakedButton linkColor type="button" onClick={handleDismiss}>
					<Text id="my-zimlet.dismiss" />
				</NakedButton>
			</div>
		</WarningBanner>
	);
};

export default withIntl()(ExternalSenderBanner);
