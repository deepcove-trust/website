import React, { Component, Fragment } from 'react';
import { Button, BtnGroup } from '../../Components/Button';


export default class TextControls extends Component {
    render() {

        return (
            <Fragment>
                <TextButtons edit={this.props.edit}
                    allowEdits={this.props.allowEdits}
                    setEditMode={this.props.setEditMode}
                    settings={this.props.settings}
                    reset={this.props.reset}
                    pushChanges={this.props.pushChanges}
                />
            </Fragment>
        )
    }
}

export class TextButtons extends Component {
    render() {
        if (!this.props.allowEdits || !this.props.settings)
            return null;

        if (!this.props.edit) return (
            <Fragment>
                <Button className="btn btn-dark btn-sm d-block ml-auto mr-0" cb={this.props.setEditMode.bind(this, true)}>
                    Edit Section &nbsp; <i className="fa fa-pencil" />
                </Button>

                <hr />
            </Fragment>
        );

        return (
            <BtnGroup className="d-block text-right mb-3">
                <Button className="btn btn-dark btn-sm" cb={this.props.reset}>
                    Undo <i className="fas fa-undo" />
                </Button>

                <Button className="btn btn-info border-dark btn-sm" cb={this.props.pushChanges}>
                    <i className="fas fa-check" />
                </Button>
            </BtnGroup>
        );
    }
}