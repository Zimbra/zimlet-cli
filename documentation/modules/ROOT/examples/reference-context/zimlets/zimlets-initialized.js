export default function Zimlet(context) {
	const { zimlets } = context;
	let calls = 0;

	return {
		init() {
			zimlets.on('zimlets-initialized', () => {
				calls += 1;
				console.warn('Call', calls, 'routes in use:', zimlets.isSlotActive('slot::routes'));
			});
		}
	};
}
