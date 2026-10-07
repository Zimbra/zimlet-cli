Issuing Toast Notifications is a particular case of [Using Redux in Zimlets](https://github.com/Zimbra/zimlet-cli/wiki/Using-Redux-in-Zimlets).

## Dispatching Toast Notifications from a Component

Use `wiretie` to get `dispatch` and `notify` from context.

```js
import wire from 'wiretie';
import { connect } from 'preact-redux';
import { withText } from 'preact-i18n';

/**
 * withText is used to get the message text
 */
@withText({
	errorMessage: 'notification-zimlet.errorMessage',
	successMessage: 'notification-zimlet.successMessage'
})
/**
 * Wiretie is used to mapContextToProps
 */
@wire('store', null, store => ({
	dispatch: store.dispatch,
	notify: store.zimletRedux.actions.notifications.notify
}))
class NotificationComponent extends Component {

	handleError = () => {
		const { dispatch, notify, errorMessage } = this.props;

		dispatch(
			notify({
				failure: true,
				message: errorMessage
			})
		);
	};

	handleSuccess = () => {
		const { dispatch, notify, successMessage } = this.props;

		dispatch(notify({message: successMessage}));
	};
}
```