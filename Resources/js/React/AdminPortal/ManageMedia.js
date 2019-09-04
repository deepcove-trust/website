import React, { Component } from 'react';
import { render } from 'react-dom';

export default class ManageMedia extends Component {
    render() {
        return <div />
    }
}

if (document.getElementById('react_ManageMedia'))
    render(<ManageMedia />, document.getElementById('react_ManageMedia'));    