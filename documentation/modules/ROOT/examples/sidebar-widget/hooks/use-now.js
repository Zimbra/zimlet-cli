import { useEffect, useState } from 'preact/hooks';

// Returns the current date and time, and a new value every intervalMs.
export function useNow(intervalMs) {
	const [now, setNow] = useState(() => new Date());

	useEffect(() => {
		const timer = setInterval(() => setNow(new Date()), intervalMs);
		// Without this, a timer stays behind each time the user leaves the screen.
		return () => clearInterval(timer);
	}, [intervalMs]);

	return now;
}
