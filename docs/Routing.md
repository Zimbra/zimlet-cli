The `preact-router` shim exposes the routing library from Zimbra to Zimlets. The idea of Router is to keep the UI in sync with the URL.

Here is an example that mimics an HTML Link in Preact:

      import { createElement, Component } from 'preact';
      import { route } from 'preact-router';
      
      export default class MyComponent extends Component {
          handleLinkClick = () => {
              route(`/helloworld`);
          }
          
          render() {
              return (
                  <div onClick={this.handleClick}>
                     Click here
                  </div>
              );
          }
      }


To add the `/helloworld` as a location and load a component into it, you have to register it like so:

      //Load components from Zimbra
      import { createElement } from "preact";
      
      //Load the App component from our Zimlet
      import App from "./components/app";
      
      //Create function by Zimbra convention
      export default function Zimlet(context) {
         //Get the 'plugins' object from context and define it in the current scope
         const { plugins } = context;
         const exports = {};
         
         
         exports.init = function init() {
            plugins.register("slot::routes", Router);
         };
      
         // Register a new route with the preact-router instance
         function Router() {
            return [<App path="/helloworld" />];
         }
      
         return exports;
      }

See https://github.com/Zimbra/zm-zimlet-guide for a full example.