## Zimbra 9 Zimlet guide

An extensive getting started guide on how to create Zimlets and Java extensions can be found at:
- https://github.com/Zimbra/zm-extension-guide
- https://github.com/Zimbra/zm-zimlet-guide

## Unfamiliar with React and Preact

*  [Preact Getting Started Guide](https://preactjs.com/guide/getting-started)
*  [Props Down Events Up](https://jasonformat.com/props-down-events-up/)
*  [Differences to React](https://github.com/developit/preact/wiki/Differences-to-React)

## Already a React/Preact Pro? 

* [Context](https://reactjs.org/docs/context.html) from React/Preact - We use it a lot in zimlets to pass reusable components around, so it would be good to understand what it is an how it works
* [Recompose](https://github.com/acdlite/recompose/blob/master/docs/API.md) - We use it to chain decorators together to add extra functionality to functional components
* [Wiretie](https://github.com/synacor/wiretie) - Useful for making API calls to and giving the results to your component as props, while handling loading and error states.  Also useful to inject elements from context into your component as props.
* [Redux]( https://egghead.io/courses/getting-started-with-redux) - We use it for some shared state management, like what URL/vertical the app is currently in (useful since zimlets are sandboxed and can't see window.location)