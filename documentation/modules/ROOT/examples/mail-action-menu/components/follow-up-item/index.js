import { createElement } from 'preact';
import { useCallback } from 'preact/hooks';
import { useDispatch } from 'react-redux';
import { Text, useText } from '@zimbra/preact-i18n';
import { ActionMenuItem } from '@zimbra-client/components';
import { BellIcon } from 'lucide-preact';
import { withIntl } from '../../enhancers';
import useFollowUp from '../../hooks/use-follow-up';
import { hasFollowUpTag } from '../../utils/has-follow-up-tag';

// A menu item that tags the open or selected messages for follow up and reports the result.
const FollowUpItem = ({ zimbraBatchClient, notify, emailData, selectedMails }) => {
	const dispatch = useDispatch();
	const markForFollowUp = useFollowUp(zimbraBatchClient);
	const { done, doneNewTag, reload, failed } = useText({
		done: 'my-zimlet.followUp.done',
		doneNewTag: 'my-zimlet.followUp.doneNewTag',
		reload: 'my-zimlet.followUp.reload',
		failed: 'my-zimlet.followUp.failed'
	});

	// The More menu of an open message passes no selection, so it falls back to the open message.
	const messages = selectedMails?.length ? selectedMails : [emailData].filter(Boolean);

	const handleClick = useCallback(() => {
		return markForFollowUp(messages).then(({ marked, created }) => {
			if (!marked) {
				return dispatch(notify({ message: failed, failure: true }));
			}

			// The Modern UI does not show a tag that was just created until the page is reloaded. A Zimlet
			// runs in a hidden frame, so reload the parent window, which is the Modern UI.
			return dispatch(
				notify(
					created
						? {
								message: doneNewTag,
								action: { label: reload, fn: () => window.parent.location.reload() },
								duration: 10000
							}
						: { message: done }
				)
			);
		});
	}, [dispatch, notify, markForFollowUp, messages, done, doneNewTag, reload, failed]);

	// The item is off when no message is selected, or when every message already has the tag.
	const disabled = messages.every(hasFollowUpTag);

	return (
		<ActionMenuItem icon={BellIcon} disabled={disabled} onClick={handleClick}>
			<Text id="my-zimlet.followUp.menuItem" />
		</ActionMenuItem>
	);
};

export default withIntl()(FollowUpItem);
