import { createElement } from 'preact';
import { useCallback } from 'preact/hooks';
import { useDispatch, useSelector } from 'react-redux';
import { setFocusMode } from './store/actions';
import { reducer } from './store/reducer';

// Start the namespace with the Zimlet name, so it cannot clash with a key of the Modern UI.
const NAMESPACE = 'my-zimlet';

// Use localization for visible text in a real Zimlet.
const TOGGLE_LABEL = 'Focus mode';
const STATUS_LABEL = 'Focus mode is on.';

const FocusToggle = () => {
	const dispatch = useDispatch();
	const isFocusMode = useSelector(state => Boolean(state[NAMESPACE]?.isFocusMode));
	const toggle = useCallback(event => dispatch(setFocusMode(event.target.checked)), [dispatch]);

	return (
		<label>
			<input type="checkbox" checked={isFocusMode} onChange={toggle} />
			{TOGGLE_LABEL}
		</label>
	);
};

const FocusStatus = () => {
	const isFocusMode = useSelector(state => Boolean(state[NAMESPACE]?.isFocusMode));

	return isFocusMode ? <p>{STATUS_LABEL}</p> : null;
};

export default function Zimlet(context) {
	const {
		plugins,
		store: { zimletRedux }
	} = context;

	return {
		init() {
			zimletRedux.injectAsyncReducer(NAMESPACE, reducer);
			plugins.register('slot::mail-sidebar-footer', FocusToggle);
			plugins.register('slot::folder-list-end', FocusStatus);
		}
	};
}
