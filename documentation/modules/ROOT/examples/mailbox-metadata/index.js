import { createElement } from 'preact';
import { useCallback, useEffect, useState } from 'preact/hooks';

// A section name starts with the prefix zwc and a colon.
const SECTION = 'zwc:my-zimlet';
const KEY = 'note';

// Use localization for visible text in a real Zimlet.
const INPUT_LABEL = 'Note';
const BUTTON_LABEL = 'Save';

export default function Zimlet(context) {
	const { plugins, zimbraBatchClient } = context;

	const readNote = () =>
		zimbraBatchClient
			.jsonRequest({ name: 'GetMailboxMetadata', body: { meta: { section: SECTION } } })
			.then(response => response.meta?.[0]?._attrs?.[KEY] ?? '');

	const saveNote = note =>
		zimbraBatchClient.jsonRequest({
			name: 'ModifyMailboxMetadata',
			body: { meta: { section: SECTION, _attrs: { [KEY]: note } } }
		});

	const NoteBox = () => {
		const [note, setNote] = useState('');

		useEffect(() => {
			readNote()
				.then(setNote)
				.catch(error => console.error(error));
		}, []);

		const changeNote = useCallback(event => setNote(event.target.value), []);
		const save = useCallback(() => saveNote(note).catch(error => console.error(error)), [note]);

		return (
			<div>
				<input aria-label={INPUT_LABEL} value={note} onInput={changeNote} />
				<button type="button" onClick={save}>
					{BUTTON_LABEL}
				</button>
			</div>
		);
	};

	return {
		init() {
			plugins.register('slot::mail-sidebar-footer', NoteBox);
		}
	};
}
