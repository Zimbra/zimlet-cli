const FALLBACK_NAME = 'event';

// The title of an event can hold characters that a file name cannot, and an event can have no title.
export const getFileName = ({ name }) => {
	const title = (name || '').replace(/[\\/:*?"<>|]/g, '-').trim();

	return `${title || FALLBACK_NAME}.ics`;
};
