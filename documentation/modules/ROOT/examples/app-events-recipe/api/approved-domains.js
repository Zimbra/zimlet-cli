import { KEY, SECTION } from '../constants';

export const readApprovedDomains = zimbraBatchClient =>
	zimbraBatchClient
		.jsonRequest({ name: 'GetMailboxMetadata', body: { meta: { section: SECTION } } })
		.then(response => (response.meta?.[0]?._attrs?.[KEY] ?? '').split(',').filter(Boolean));

export const saveApprovedDomains = (zimbraBatchClient, domains) =>
	zimbraBatchClient.jsonRequest({
		name: 'ModifyMailboxMetadata',
		body: { meta: { section: SECTION, _attrs: { [KEY]: domains.join(',') } } }
	});
