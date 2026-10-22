export default function Zimlet(context) {
	const { meta } = context;

	return {
		init() {
			const { version, hash } = meta.build;
			console.warn('Modern UI', version, hash);
		}
	};
}
