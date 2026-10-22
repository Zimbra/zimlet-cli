const INCREMENT = 'MY_ZIMLET_INCREMENT';

const counter = (state = { count: 0 }, action) =>
	action.type === INCREMENT ? { count: state.count + 1 } : state;

export default function Zimlet(context) {
	const { store } = context;

	return {
		init() {
			store.zimletRedux.injectAsyncReducer('myZimletCounter', counter);
			store.dispatch({ type: INCREMENT });
			console.warn('Count:', store.getState().myZimletCounter.count);
		}
	};
}
