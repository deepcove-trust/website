import React, { Component, Fragment } from 'react';
import { render } from 'react-dom';

export default class FactFiles extends Component {
    render() {
        return (
            <h1>Reactified Fact Files</h1>
        );
    }
}

if (document.getElementById('react_app_factfiles')) {
    render(<FactFiles />, document.getElementById('react_app_factfiles'));
}