import React, { Component } from 'react';
import { Button, ConfirmButton } from '../../Components/Button';

const Mode = {
    View: 'view',
    Edit: 'edit'
}

export class DeleteUser extends Component {
    render() {
        return (
            <ConfirmButton className="btn btn-danger mt-3" cb={this.props.deleteUser.bind(this, this.props.account)} pending={this.props.requestPending}>
                Delete User <i className="fas fa-user-times"></i>
            </ConfirmButton>
        )
    }
}

export class ResetPassword extends Component {
    constructor(props) {
        super(props);

        this.state = {
            requestPending: false
        };
    };

    render() {
        return (
            <ConfirmButton className="btn btn-dark mt-3 mx-1" cb={this.props.forceReset.bind(this, this.props.account)} pending={this.props.requestPending}>
                Reset Password <i className="fas fa-user-lock"></i>
            </ConfirmButton>
        )
    }
}  

export class EditButtons extends Component {
    render() {
        let buttons;
        if (this.props.mode == Mode.View) {
            buttons = (
                <Button className="btn btn-info btn-sm" cb={this.props.setModeCb.bind(this, Mode.Edit)}>
                    Edit <i className="fas fa-pencil"></i>
                </Button>
            )
        } else {
            buttons = (
                <div role="group" className="btn-group btn-group-sm">
                    <Button className="btn btn-danger" cb={this.props.cancelCb.bind(this)}>
                        Cancel <i className="fas fa-times"></i>
                    </Button>

                    <Button className="btn btn-success" cb={this.props.updateCb.bind(this)}>
                        Save <i className="fas fa-check"></i>
                    </Button>
                </div>
            )
        } 

        return (
            <div className="text-center pb-2">
                {buttons}
            </div>
        )
    }
}