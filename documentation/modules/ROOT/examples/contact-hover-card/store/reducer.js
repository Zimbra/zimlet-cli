import { handleActions } from 'redux-actions';
import { setVips } from './actions';

// `loaded` stays false until the list has arrived from the server.
export const reducer = handleActions(
	{
		[setVips]: (state, { payload }) => ({ vips: payload, loaded: true })
	},
	{ vips: [], loaded: false }
);
