import React, { Component, Fragment } from 'react';
import { render } from 'react-dom';

export default class Overview extends Component {
    render() {
        return (
            <h1>Reactified Overview</h1>
        );
    }
}

if (document.getElementById('react_app_overview')) {
    render(<Overview />, document.getElementById('react_app_overview'));
}