In some cases it is necessary to implement multiple React components in a Zimlet. For example if you want to implement a Zimlet that sets customer headers on an outgoing email, you would need one component that shows the user a menu to click and another component that deals with the actual setting of the header.

In this case you will need to use Redux and store a variable when the menu is clicked, then based on that variable you can set the headers in the second component.

To find out how Redux works, take a look at this example Zimlet, which is meant to run on Zimbra 10.0.9 and above:

https://github.com/Zimbra/zimbra-zimlet-send-header