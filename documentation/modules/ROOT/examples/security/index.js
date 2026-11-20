import { createElement } from 'preact';
import { useCallback, useEffect, useRef, useState } from 'preact/hooks';
import DOMPurify from 'dompurify';

// Use localization for visible text in a real Zimlet.
const INPUT_LABEL = 'Paste the HTML of a note';
const PREVIEW_LABEL = 'Preview';

// Allow only the markup that a note needs. Everything else is removed.
const SANITIZE_OPTIONS = {
	ALLOWED_TAGS: ['p', 'br', 'b', 'i', 'ul', 'ol', 'li', 'a'],
	ALLOWED_ATTR: ['href']
};

const NotePreview = () => {
	const [html, setHtml] = useState('');
	const previewRef = useRef(null);

	const changeHtml = useCallback(event => setHtml(event.target.value), []);

	useEffect(() => {
		previewRef.current.innerHTML = DOMPurify.sanitize(html, SANITIZE_OPTIONS);
	}, [html]);

	return (
		<div>
			<label>
				{INPUT_LABEL}
				<textarea value={html} onInput={changeHtml} />
			</label>
			<h3>{PREVIEW_LABEL}</h3>
			<div ref={previewRef} />
		</div>
	);
};

export default function Zimlet(context) {
	const { plugins } = context;

	return {
		init() {
			plugins.register('slot::mail-sidebar-footer', NotePreview);
		}
	};
}
