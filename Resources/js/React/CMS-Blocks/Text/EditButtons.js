import React, { Component } from 'react';
import { Button, ConfirmButton } from '../../Components/Button';

const Mode = {
    View: 'view',
    Edit: 'edit',
    Preview: 'preview'
}

export default class EditButton extends Component {
    render() {
        let btnCenter;
        if (this.props.mode == Mode.Preview) {
            btnCenter = (
                <Button btnClass="btn btn-info" type="button" cb={this.props.editMode.bind(this, Mode.Edit)}>
                    Edit <i className="fa fa-pencil"></i>
                </Button>
            )
        } else {
            btnCenter = (
                <Button btnClass="btn btn-info" type="button" cb={this.props.editMode.bind(this, Mode.Preview)}>
                    Preview <i className="fa fa-binoculars"></i>
                </Button>
            )
        }

        // If we are in view mode, 
        // do not render the component
        if (this.props.mode == Mode.View)
            return null;

        return (
            <div role="group" className="btn-group btn-group-sm pb-2 d-block">
                <ConfirmButton btnClass="btn btn-danger" cb={this.props.cancelEditMode.bind(this)}>
                    Cancel <i className="fas fa-times"></i>
                </ConfirmButton>

                {btnCenter}

                <ConfirmButton pending={this.props.requestPending} cb={this.props.saveChanges.bind(this)} btnClass="btn btn-success">
                    Save <i className="fa fa-check"></i>
                </ConfirmButton>
            </div>
        )
    }
}