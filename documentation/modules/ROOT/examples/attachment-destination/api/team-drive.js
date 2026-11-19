import { FOLDER_NAME, ROOT_FOLDER_ID } from '../constants';

// Creates the folder, or returns the existing one because `fie` is set.
const ensureTeamDrive = zimbraBatchClient =>
	zimbraBatchClient
		.jsonRequest({
			name: 'CreateFolder',
			body: { folder: { name: FOLDER_NAME, view: 'document', l: ROOT_FOLDER_ID, fie: true } }
		})
		.then(({ folder }) => folder[0].id);

// Saves a part of a message as a document. The server reads the file from the message, so
// the file never passes through the browser.
const saveAttachment = (zimbraBatchClient, folderId, { filename, name, messageId, part }) =>
	zimbraBatchClient.jsonRequest({
		name: 'SaveDocument',
		body: { doc: { l: folderId, name: name || filename, m: { id: messageId, part } } }
	});

export const saveToTeamDrive = (zimbraBatchClient, attachments) =>
	ensureTeamDrive(zimbraBatchClient).then(folderId =>
		Promise.all(
			attachments.map(attachment => saveAttachment(zimbraBatchClient, folderId, attachment))
		)
	);
