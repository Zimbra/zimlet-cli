import { KEY, SECTION } from '../constants';

// Resolves to the list of VIP addresses, empty when none is saved.
export const readVips = zimbraBatchClient =>
	zimbraBatchClient
		.jsonRequest({ name: 'GetMailboxMetadata', body: { meta: { section: SECTION } } })
		.then(response => {
			const text = response.meta?.[0]?._attrs?.[KEY] ?? '';
			return text ? text.split(',') : [];
		});

// A value is always text, so the list is saved as addresses separated by commas. An empty value
// removes the key.
export const saveVips = (zimbraBatchClient, vips) =>
	zimbraBatchClient.jsonRequest({
		name: 'ModifyMailboxMetadata',
		body: { meta: { section: SECTION, _attrs: { [KEY]: vips.join(',') } } }
	});
