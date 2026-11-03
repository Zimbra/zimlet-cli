import { useEffect, useState } from 'preact/hooks';

// Counts the web links in the text of the message. `htmlUpdated` changes when the text
// changes, so the count is read again then.
export function useLinkCount(viewerRef, htmlUpdated) {
	const [count, setCount] = useState(0);

	useEffect(() => {
		setCount(viewerRef?.current?.querySelectorAll('a[href^="http"]').length ?? 0);
	}, [viewerRef, htmlUpdated]);

	return count;
}
