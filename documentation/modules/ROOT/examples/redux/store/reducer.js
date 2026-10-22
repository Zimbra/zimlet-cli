import { handleActions } from 'redux-actions';
import { setFocusMode } from './actions';

export const reducer = handleActions(
	{
		[setFocusMode]: (state, { payload }) => ({ ...state, isFocusMode: payload })
	},
	{ isFocusMode: false }
);
