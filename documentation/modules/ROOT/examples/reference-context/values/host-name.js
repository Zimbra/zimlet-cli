export default function Zimlet(context) {
	const { hostName } = context;

	return {
		init() {
			if (hostName === 'localhost') {
				console.warn('Running on a local test server');
			}
		}
	};
}
