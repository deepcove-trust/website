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
            <div className="row">
                <div className="col-lg-4 offset-md-3 col-md-5 col-sm-12">
                    other actions here
                </div>
                <div className="col-lg-4 offset-md-1 col-md-6 col-sm-12">
                    <Button className="btn btn-dark btn-sm" cb={this.props.revert}>
                        Revert Changes <i className="fas fa-undo" />
                    </Button>
                    <Button className="btn btn-success btn-sm" cb={this.props.publish}>
                        Publish Changes <i className="fas fa-check-circle"/>
                    </Button>
                </div>
            </div>
        );
    }
}