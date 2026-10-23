export default function Zimlet(context) {
	const { zimlets } = context;

	return {
		init() {
			zimlets.on('my-zimlet.theme-changed', ({ theme }) => console.warn('Theme:', theme));
			zimlets.emit('my-zimlet.theme-changed', { theme: 'dark' });
		}
	};
}
