import React, { Component, Fragment } from 'react';
import { render } from 'react-dom';

export default class Quizzes extends Component {
    render() {
        return (
            <h1>Reactified Quizzes</h1>
        );
    }
}

if (document.getElementById('react_app_quizzes')) {
    render(<Quizzes />, document.getElementById('react_app_quizzes'));
}