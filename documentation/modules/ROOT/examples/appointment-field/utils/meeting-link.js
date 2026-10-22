import { MEETING_BASE_URL } from '../constants';

const isText = location => typeof location === 'string';

// The editor keeps rooms as contacts and the text that the user types as one string at the end.
const getText = locations => locations.filter(isText).pop() || '';

const getParts = locations =>
	getText(locations)
		.split(/\s*[,;]\s*/)
		.filter(Boolean);

const isMeetingLink = part => part.startsWith(`${MEETING_BASE_URL}/`);

const withText = (locations, parts) => {
	const rooms = locations.filter(location => !isText(location));
	const text = parts.join(', ');
	return text ? [...rooms, text] : rooms;
};

export const findMeetingLink = locations => getParts(locations).find(isMeetingLink);

export const addMeetingLink = locations => {
	const bytes = crypto.getRandomValues(new Uint8Array(8));
	const room = Array.from(bytes, byte => byte.toString(16).padStart(2, '0')).join('');
	return withText(locations, [...getParts(locations), `${MEETING_BASE_URL}/${room}`]);
};

export const removeMeetingLink = locations =>
	withText(
		locations,
		getParts(locations).filter(part => !isMeetingLink(part))
	);
