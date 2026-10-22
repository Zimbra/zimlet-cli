import { FOLDER_NAME, PAGE_SIZE, ROOT_FOLDER_ID } from '../constants';

// A contact comes back with its fields in the `_attrs` object.
const toPartner = ({ id, _attrs = {} }) => ({ id, email: _attrs.email || '' });

// Creates the address book, or returns the existing one because `fie` is set.
export const ensurePartnersFolder = zimbraBatchClient =>
	zimbraBatchClient
		.jsonRequest({
			name: 'CreateFolder',
			body: { folder: { name: FOLDER_NAME, view: 'contact', l: ROOT_FOLDER_ID, fie: true } }
		})
		.then(({ folder }) => folder[0].id);

export const listPartners = (zimbraBatchClient, folderId) =>
	zimbraBatchClient
		.jsonRequest({
			name: 'Search',
			body: { query: `inid:${folderId}`, types: 'contact', sortBy: 'nameAsc', limit: PAGE_SIZE }
		})
		.then(({ cn = [] }) => cn.map(toPartner));

// A request sends a field as an item of the list `a`, with the name `n` and the value `_content`.
export const createPartner = (zimbraBatchClient, folderId, email) =>
	zimbraBatchClient.jsonRequest({
		name: 'CreateContact',
		body: { cn: { l: folderId, a: [{ n: 'email', _content: email }] } }
	});

export const removePartner = (zimbraBatchClient, id) =>
	zimbraBatchClient.jsonRequest({
		name: 'ContactAction',
		body: { action: { op: 'trash', id } }
	});
