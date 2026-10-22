import { createElement } from 'preact';
import MeetingsScreen from '../meetings-screen';
import useMeetingsPath from '../../hooks/use-meetings-path';

// The route handler: the router shows the screen when the address matches the path.
export default function MeetingsRoute() {
	const path = useMeetingsPath();

	return <MeetingsScreen path={path} />;
}
