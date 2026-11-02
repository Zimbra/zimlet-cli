import { createElement } from 'preact';
import { useEffect, useState } from 'preact/hooks';
import { getStatus } from 'service-client';

// Use localization for visible text in a real Zimlet.
const STATUS_LABEL = 'Service status:';
const UNAVAILABLE_LABEL = 'unavailable';

export default function Zimlet(context) {
	const { plugins, zimbraOrigin } = context;

	const ServiceStatus = () => {
		const [status, setStatus] = useState('');

		useEffect(() => {
			getStatus(zimbraOrigin)
				.then(setStatus)
				.catch(() => setStatus(UNAVAILABLE_LABEL));
		}, []);

		return status && <p>{`${STATUS_LABEL} ${status}`}</p>;
	};

	return {
		init() {
			plugins.register('slot::mail-sidebar-footer', ServiceStatus);
		}
	};
}
