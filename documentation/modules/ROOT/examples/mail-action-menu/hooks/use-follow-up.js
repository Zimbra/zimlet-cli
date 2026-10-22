import { useCallback } from 'preact/hooks';
import { useItemActionMutation } from '@zimbra-client/hooks';
import { ensureFollowUpTag } from '../api/tags';
import { FOLLOW_UP_TAG } from '../constants';

// Returns a function that tags messages for follow up. It resolves to { marked, created }: marked is
// false when a request fails, and created is true when this call created the tag.
export default function useFollowUp(zimbraBatchClient) {
	const [itemAction] = useItemActionMutation();

	return useCallback(
		messages =>
			ensureFollowUpTag(zimbraBatchClient)
				.then(created => {
					// One request tags every message: the server accepts a list of ids separated by commas.
					const id = messages.map(message => message.id).join(',');
					return itemAction({ variables: { id, op: 'tag', tagNames: FOLLOW_UP_TAG } }).then(() => ({
						marked: true,
						created
					}));
				})
				.catch(() => ({ marked: false, created: false })),
		[zimbraBatchClient, itemAction]
	);
}
