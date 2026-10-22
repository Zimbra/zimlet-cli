import { useCallback, useState } from 'preact/hooks';
import { useDispatch, useSelector } from 'react-redux';
import { useText } from '@zimbra/preact-i18n';
import { saveVips } from '../api/vips';
import { NAMESPACE } from '../constants';
import { setVips } from '../store/actions';
import normalizeAddress from '../utils/normalize-address';
import useIsVip from './use-is-vip';

// Returns what the control needs: whether the address is a VIP, whether the toggle can run, and
// the function that adds the address to the list or removes it.
export default function useToggleVip(zimbraBatchClient, notify, email) {
	const address = normalizeAddress(email);
	const isVip = useIsVip(email);
	const vips = useSelector(state => state[NAMESPACE]?.vips);
	const loaded = useSelector(state => Boolean(state[NAMESPACE]?.loaded));
	const dispatch = useDispatch();
	const [saving, setSaving] = useState(false);
	const { failed } = useText({ failed: 'my-zimlet.failed' });

	const toggle = useCallback(() => {
		const next = isVip ? vips.filter(item => item !== address) : [...vips, address];

		setSaving(true);
		return saveVips(zimbraBatchClient, next)
			.then(() => dispatch(setVips(next)))
			.catch(() => dispatch(notify({ message: failed, failure: true })))
			.finally(() => setSaving(false));
	}, [vips, dispatch, notify, zimbraBatchClient, address, isVip, failed]);

	return { isVip, canToggle: loaded && !saving, toggle };
}
