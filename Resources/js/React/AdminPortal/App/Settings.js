import React, { Component, Fragment } from 'react';
import { render } from 'react-dom';

export default class Settings extends Component {
    render() {
        return (
            <h1>Reactified Settings</h1>
        );
    }
}

if (document.getElementById('react_app_settings')) {
    render(<Settings />, document.getElementById('react_app_settings'));
}