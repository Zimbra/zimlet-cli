// These four imports are shared modules. The Modern UI provides them, so the bundle does not copy them.
import { createElement } from 'preact';
import { useCallback, useState } from 'preact/hooks';
import moment from 'moment';
import { Button } from '@zimbra-client/blocks';
// This library is not shared. The build copies the icon into the bundle.
import { CalendarIcon } from 'lucide-preact';

// Use localization for visible text in a real Zimlet.
const TODAY_LABEL = 'Today:';

export default function Today() {
	const [showWeekday, setShowWeekday] = useState(true);
	const date = moment().format(showWeekday ? 'dddd, D MMMM' : 'D MMM YYYY');
	const toggle = useCallback(() => setShowWeekday(shown => !shown), []);

	return (
		<Button icon={CalendarIcon} onClick={toggle}>
			{TODAY_LABEL} {date}
		</Button>
	);
}
