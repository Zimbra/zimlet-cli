import { createElement } from 'preact';
import { useCallback } from 'preact/hooks';
import { Text, useText } from '@zimbra/preact-i18n';
import { ActionMenuGroup, ActionMenuItem } from '@zimbra-client/components';
import { ShieldAlertIcon, TagIcon } from 'lucide-preact';
import { SUBJECT_PREFIX } from '../../constants';
import { withIntl } from '../../enhancers';

const ConfidentialityOptions = ({ insertAtCaret, isPlainText, getSubject, setSubject }) => {
	const { notice } = useText('my-zimlet.notice');
	const isMarked = (getSubject() ?? '').startsWith(SUBJECT_PREFIX);

	const handleInsertNotice = useCallback(
		() => insertAtCaret(`<p>${notice}</p>`),
		[insertAtCaret, notice]
	);

	const handleMarkSubject = useCallback(
		() => setSubject(`${SUBJECT_PREFIX}${getSubject() ?? ''}`),
		[getSubject, setSubject]
	);

	return (
		<ActionMenuGroup>
			{/* The editor inserts only HTML, so the item has no use in a plain text message. */}
			{!isPlainText && (
				<ActionMenuItem icon={ShieldAlertIcon} onClick={handleInsertNotice}>
					<Text id="my-zimlet.insertNotice" />
				</ActionMenuItem>
			)}
			<ActionMenuItem icon={TagIcon} disabled={isMarked} onClick={handleMarkSubject}>
				<Text id="my-zimlet.markSubject" />
			</ActionMenuItem>
		</ActionMenuGroup>
	);
};

export default withIntl()(ConfidentialityOptions);
