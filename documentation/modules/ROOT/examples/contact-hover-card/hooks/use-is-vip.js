import { useSelector } from 'react-redux';
import { NAMESPACE } from '../constants';
import normalizeAddress from '../utils/normalize-address';

// The state does not exist until init() has added the reducer, so read it with optional chaining.
export default function useIsVip(email) {
	const address = normalizeAddress(email);

	return useSelector(state => Boolean(state[NAMESPACE]?.vips.includes(address)));
}
