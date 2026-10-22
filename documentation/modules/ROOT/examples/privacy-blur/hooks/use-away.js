import { useEffect, useState } from 'preact/hooks';

// Returns true while the user is not looking at the Modern UI: the tab is hidden or another window has the focus.
export function useAway() {
	const [away, setAway] = useState(false);

	useEffect(() => {
		// The Zimlet runs in its own frame, so the page of the Modern UI is the parent window.
		const page = window.parent;
		const update = () => setAway(page.document.hidden || !page.document.hasFocus());
		// The focus moves a moment after the blur event, so check again after the move.
		const onBlur = () => setTimeout(update, 0);

		page.addEventListener('blur', onBlur);
		page.addEventListener('focus', update);
		page.document.addEventListener('visibilitychange', update);
		update();

		return () => {
			page.removeEventListener('blur', onBlur);
			page.removeEventListener('focus', update);
			page.document.removeEventListener('visibilitychange', update);
		};
	}, []);

	return away;
}
