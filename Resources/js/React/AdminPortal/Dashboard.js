import React, { Component, Fragment } from 'react';
import { render } from 'react-dom';
import { StaticAlert } from '../Components/Alert';

export default class Overview extends Component {
    render() {
        return (
            <Fragment>
                <h1>Reactified Overview</h1>
                <StaticAlert type="danger">Coming Soon</StaticAlert>
                <strong>Admin dashboard will show</strong>
                <ul>
                    <li>Number of Quizes</li>
                    <li>Number of Fact Files and categories</li>
                    <li>Number of Walks and their activities</li>
                    <li>Overview of urgent notices</li>
                    <li>Some web stats</li>
                </ul>
            </Fragment>
        );
    }
}

if (document.getElementById('react_admin_dashboard')) {
    render(<Overview />, document.getElementById('react_admin_dashboard'));
}