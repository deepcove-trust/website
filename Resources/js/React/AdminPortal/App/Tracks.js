import React, { Component, Fragment } from 'react';
import { render } from 'react-dom';

export default class Tracks extends Component {
    render() {
        return (
            <h1>Reactified Tracks</h1>
        );
    }
}

if (document.getElementById('react_app_tracks')) {
    render(<Tracks />, document.getElementById('react_app_tracks'));
}