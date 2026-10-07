// tag::zimlet-routing[]

import { createElement, Component } from 'preact';
import { route } from 'preact-router';

export default class MyComponent extends Component {
    handleLinkClick = () => {
        route(`/hello`);
    }

    render() {
        return (
            <div onClick={this.handleClick}>
                Click here
            </div>
        );
    }
}

// end::zimlet-routing[]