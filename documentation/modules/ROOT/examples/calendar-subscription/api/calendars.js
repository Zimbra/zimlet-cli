// Creates a calendar that the server fills from the feed at `url`. The flag `#` marks the
// calendar as checked, so that its events show in the calendar.
export const subscribeToCalendar = (zimbraBatchClient, { name, url }) =>
	zimbraBatchClient.jsonRequest({
		name: 'CreateFolder',
		body: { folder: { name, url, view: 'appointment', f: '#' } }
	});
