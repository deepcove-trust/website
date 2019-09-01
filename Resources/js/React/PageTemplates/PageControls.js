import React, { Component, Fragment } from 'react';
import { Button } from '../Components/Button';


export default class PageControls extends Component {
    render() {
        if (!this.props.allowEdits)
            return (
                <Button btnClass="btn btn-dark float-right" cb={this.props.editMode.bind(this, true)}>
                    Edit Page
                </Button>
            );

        return (
            <div className="row col-12">
                <h1>TODO Edit TOOLBAR</h1>
            </div>
        );
    }
}