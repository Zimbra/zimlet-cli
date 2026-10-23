export default function Zimlet(context) {
	const { zimletRedux } = context.store;

	return {
		init() {
			console.warn('Namespaces with selectors:', Object.keys(zimletRedux.selectors));
		}
	};
}
