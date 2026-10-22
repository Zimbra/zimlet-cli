import { FOLLOW_UP_TAG, FOLLOW_UP_TAG_COLOR } from '../constants';

// Creates the tag when the user does not have it yet, and resolves to true when it did. A tag that
// the server creates while it tags a message is hidden from the tag list of the Modern UI, so the
// tag is created first.
export const ensureFollowUpTag = zimbraBatchClient =>
	zimbraBatchClient.jsonRequest({ name: 'GetTag', body: {} }).then(({ tag = [] }) => {
		const exists = tag.some(({ name }) => name.toLowerCase() === FOLLOW_UP_TAG.toLowerCase());

		if (exists) {
			return false;
		}

		return zimbraBatchClient
			.jsonRequest({
				name: 'CreateTag',
				body: { tag: { name: FOLLOW_UP_TAG, color: FOLLOW_UP_TAG_COLOR } }
			})
			.then(() => true);
	});
