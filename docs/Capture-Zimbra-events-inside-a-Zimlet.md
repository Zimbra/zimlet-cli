## zimletEventEmitter events 

Zimlets can register listeners that are provided via zimletEventEmitter. The following events are supported:

- AFTERONSEND
- LOGOUT
- ONBEFORESEND (props: message)
- ONSEND
- ONSENDINVITEREPLY

_New events will be added to Zimbra soon, this guide will be updated when that happens._

After the user clicks the send button and when all `ONSEND` event handlers have resolved, the `AFTERONSEND` event is fired. At this point the back-end will process the email for sending. This event can not abort the sending, so it should always resolve. This event can be used for compliance, custom logging or custom REST API calls.

The `LOGOUT` event is fired when the user clicks the `Logout` menu item. It can be used to trigger a log-out in non Single Log Out aware 3rd party application.

The `ONBEFORESEND` event is fired when the user clicks the `Send` button when sending an email. It can be used for email error checks, such as a forgotten attachment reminder. The message to send is passed via the `message` prop. See https://github.com/Zimbra/zimbra-zimlet-attachment-alert for an example.

The `ONSEND` event is fired when the user clicks the `Send` button when sending an email. It can be used for email error checks or do a check in a 3rd party application for compliance validation.

The `ONSENDINVITEREPLY` is fired when a user RSVP's to a calendar invitation. The `verb` and `invitation` are passed to the event handler. You can use the `verb` to determine if the user accepted, declined, proposed a new time or tentatively accepted the invitation. Define your handler like: `onSendHandler = (args) => {console.log(args);}`.

Here is an example of how a Zimlet registers a listener for a logout event.
```
import { zimletEventEmitter } from '@zimbra-client/util';
import { ZIMBRA_ZIMLET_EVENTS } from '@zimbra-client/constants';

const onLogoutHandler = () => { /** Do something */ };
zimletEventEmitter.on(ZIMBRA_ZIMLET_EVENTS.LOGOUT, onLogoutHandler);
```

There can be two types of handlers.
1. Handler doing synchronous tasks like - calculating something, displaying toast, or updating view/state
Here is an example of this kind of handler:
```
import { zimletEventEmitter } from '@zimbra-client/util';
import { ZIMBRA_ZIMLET_EVENTS } from '@zimbra-client/constants';

const onLogoutHandler = () => { /** Display toast message */ };
zimletEventEmitter.on(ZIMBRA_ZIMLET_EVENTS.LOGOUT, onLogoutHandler);
```


2. Handler doing asynchronous tasks like - invoke an API call or display dialog to confirm the action with the user.
Here is an example of this kind of handler:
```
import { zimletEventEmitter } from '@zimbra-client/util';
import { ZIMBRA_ZIMLET_EVENTS } from '@zimbra-client/constants';

const onLogoutHandler = () => new Promise((resolve, reject) => {
    if (window.confirm("Do you really want to logout?")) {
        resolve();
    } else {
        reject();
    }
});
zimletEventEmitter.on(ZIMBRA_ZIMLET_EVENTS.LOGOUT, onLogoutHandler, true); //the 3rd argument makes the handler asynchronous
```

To remove a listener you can use `zimletEventEmitter.off` like this:

      zimletEventEmitter.off(ZIMBRA_ZIMLET_EVENTS.LOGOUT, onLogoutHandler);


See an example Zimlet: https://github.com/Zimbra/zimbra-zimlet-attachment-alert
