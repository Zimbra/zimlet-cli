import { createElement } from 'preact';
import { useEffect, useState } from 'preact/hooks';
import { createSoapRequest } from './api/soap-request';

// Use localization for visible text in a real Zimlet.
const VERSION_LABEL = 'Server version:';

export default function Zimlet(context) {
	const { plugins, zimbraOrigin } = context;
	const soapRequest = createSoapRequest({ zimbraOrigin });

	const ServerVersion = () => {
		const [version, setVersion] = useState('');

		useEffect(() => {
			soapRequest('GetInfo', 'urn:zimbraAccount', { sections: 'attrs' })
				.then(info => setVersion(info.version))
				.catch(error => console.error(error));
		}, []);

		return version && <p>{`${VERSION_LABEL} ${version}`}</p>;
	};

	return {
		init() {
			plugins.register('slot::mail-sidebar-footer', ServerVersion);
		}
	};
}
