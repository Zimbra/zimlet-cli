// Load components from Zimbra
import { createElement } from "preact";

// Load the App component from our Zimlet
import App from "./components/app";

// Create function by Zimbra convention
export default function Zimlet(context) {
    // Get the 'plugins' object from context and define it in the current scope
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
