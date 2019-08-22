import React, { Component } from 'react';
import { Button, ConfirmButton } from '../../Components/Button';
import $ from 'jquery';

const Mode = {
    View: 'view',
    Edit: 'edit'
}

export class DeleteUser extends Component {
    constructor(props) {
        super(props);

        this.state = {
            requestPending: false
        };
    };

    DeleteUser() {
        this.setState({
            requestPending: true
        }, () => {
            $.ajax({
                type: 'delete',
                url: `${this.props.baseUri}/${this.props.accountId}`
            }).done(() => {
                this.props.u();

                this.setState({
                    requestPending: false
                });
            }).fail((err) => {
                console.error(`[DeleteUser@DeleteUser] Error deleting the account: `, err.responseText);

                this.setState({
                    requestPending: false
                });
            });
        });
    }

    render() {
        return (
            <ConfirmButton btnClass="btn btn-danger mt-3 mx-1" cb={this.DeleteUser.bind(this)} pending={this.state.requestPending}>
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

    ResetPassword() {
        this.setState({
            "requestPending": true
        }, () => {
            $.ajax({
                type: 'patch',
                url: `${this.props.baseUri}/${this.props.accountId}`
            }).done(() => {
                this.props.u();

                this.setState({
                    requestPending: false
                });
            }).fail((err) => {
                console.error(`[ResetPassword@ResetPassword] Error flagging account for a password reset: `, err.responseText);

                this.setState({
                    requestPending: false
                });
            });
        });
    }

    render() {
        return (
            <ConfirmButton btnClass="btn btn-dark mt-3 mx-1" cb={this.ResetPassword.bind(this)} pending={this.state.requestPending}>
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
                <Button btnClass="btn btn-info btn-sm" cb={this.props.setModeCb.bind(this, Mode.Edit)}>
                    Edit <i className="fas fa-pencil"></i>
                </Button>
            )
        } else {
            buttons = (
                <div role="group" class="btn-group btn-group-sm">
                    <ConfirmButton btnClass="btn btn-danger" cb={this.props.cancelCb.bind(this)}>
                        Cancel <i className="fas fa-times"></i>
                    </ConfirmButton>
                    <Button btnClass="btn btn-success" cb={this.props.updateCb.bind(this)}>
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