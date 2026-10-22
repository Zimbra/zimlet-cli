export default function Zimlet(context) {
	const { zimletRedux } = context.store;

	return {
		init() {
			zimletRedux.addSelectors('myZimlet', { isReady: () => true });
			zimletRedux.removeSelectors('myZimlet');
			console.warn('Still published:', 'myZimlet' in zimletRedux.selectors);
		}
	};
}
