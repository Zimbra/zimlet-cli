# Using Redux in Zimlets

If you are designing a complex Zimlet, you are able to dispatch actions just like the main App. When a Zimlet is initialized, the context passed to the Zimlet includes an object named `zimletRedux`. This object allows your Zimlet to interact with the store by dispatching any action, and even adding your own actions at runtime.

## Adding actions to the Store

Using the `zimletRedux` object provided in a Zimlet's context, you can add new reducers and actions to the redux store at runtime:

```js
import rootReducer from './reducer';    // the rootReducer to be added to the redux store
import actionCreators from './actions'; // actions to be made available on `zimletRedux`
import selectors from './selectors';    // selectors to be made available on `zimletRedux`

export default function FancyZimlet(context) {
	const { zimletRedux } = context;
	const exports = {};

	// Pick a namespace for the state slice of the reducer to be added
	const namespace = 'fancy';

	exports.init = function init() {
		// Inject the reducer with `injectAsyncReducer`, and that reducer will update
		// the "fancy" slice of state. Make sure not to interfere with existing names!
		zimletRedux.injectAsyncReducer(namespace, rootReducer);

		// Then add any actions and selectors to the same namespace
		// Adding actions and selectors will make them available under the
		// zimletRedux.actions[namespace] and zimletRedux.selectors[namespace] objects.
		// That way actions added by any Zimlet could interact with any other Zimlet.
		zimletRedux.addActions(namespace, actionCreators);
		zimletRedux.addSelectors(namespace, selectors);
	}
}
```

## Dispatching Actions from a Component

Use `wiretie` to get action creators from context, and then use `connect` with `bindActionCreators` to add actions as you normally would:

```js
import wire from 'wiretie';
import { connect } from 'preact-redux';
import { bindActionCreators } from 'redux';

@wire('store.zimletRedux', null, (zimletRedux) => ({
	myAction: zimletRedux.actions.fancy.myAction
}))
@connect(undefined, (dispatch, ({ myAction }) => bindActionCreators({ myAction })))
class FancyZimlet extends Component {
	render({ myAction }) {
		return (
			<button onClick={myAction} />
		)
	}
}
```

Actions and selectors are namespaced under the slice of state they interact with.
