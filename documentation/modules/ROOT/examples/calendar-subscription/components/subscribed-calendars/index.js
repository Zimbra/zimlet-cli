import { createElement, Fragment } from 'preact';
import { useCalendarsData } from '@zimbra-client/hooks/graphql';

// A calendar with an address, and no owner, is one that the user subscribed to.
const SubscribedCalendars = ({ renderItem }) => {
	const { calendars } = useCalendarsData();
	const subscribed = calendars.filter(({ owner, url }) => !owner && url);

	if (!subscribed.length) {
		return null;
	}

	return (
		<Fragment>
			{subscribed.map(calendar => (
				<Fragment key={calendar.id}>{renderItem(calendar)}</Fragment>
			))}
		</Fragment>
	);
};

export default SubscribedCalendars;
