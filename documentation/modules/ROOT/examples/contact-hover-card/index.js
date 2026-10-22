import { createElement } from 'preact';
import VipButton from './components/vip-button';
import VipDetails from './components/vip-details';
import VipMark from './components/vip-mark';
import { readVips } from './api/vips';
import { NAMESPACE } from './constants';
import { setVips } from './store/actions';
import { reducer } from './store/reducer';

export default function Zimlet(context) {
	const { plugins, store, zimbraBatchClient } = context;

	return {
		init() {
			store.zimletRedux.injectAsyncReducer(NAMESPACE, reducer);
			plugins.register('slot::address-pill', VipMark);
			// The contact card passes no address when the contact has only a work or home address.
			const renderCard = (Component, { email }) => {
				if (!email) return null;

				// Read the actions when you use them: the object is built from the current registry.
				const { notify } = store.zimletRedux.actions.notifications;

				return <Component zimbraBatchClient={zimbraBatchClient} notify={notify} email={email} />;
			};
			plugins.register('slot::contact-hover-card-details', props => renderCard(VipButton, props));
			plugins.register('slot::contact-card-item', props => renderCard(VipDetails, props));

			readVips(zimbraBatchClient)
				.then(vips => store.dispatch(setVips(vips)))
				.catch(error => console.error(error));
		}
	};
}
