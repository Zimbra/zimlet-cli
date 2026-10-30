// An event id is '1234', '-1234' or an id with a colon for an item of a shared calendar.
// Only a number takes its absolute value.
export const getExportPath = (eventId, fileName) => {
	const id = isNaN(eventId) ? eventId : Math.abs(eventId);

	return `/service/home/~/?id=${id}&fmt=ics&filename=${encodeURIComponent(fileName)}`;
};
