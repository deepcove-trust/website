import React, { Component } from 'react';
import Alert from '../Components/Alert';

export default class PageTitle extends Component {

    render() {
        let alert;
        if (!this.props.public) {
            alert = (
                <Alert type="danger">This page is hidden! Only authenticated users can see this page.</Alert>    
            )
        }

        return (
            <div className="row">
                <div className="col-12 pb-4">
                    <h1 className="mb-1">{this.props.title}</h1>
                    <small>
                        Last updated by: {this.props.created.by} on {this.props.created.at}
                    </small>

                    {alert}
                </div>
            </div>
        )
    }
}