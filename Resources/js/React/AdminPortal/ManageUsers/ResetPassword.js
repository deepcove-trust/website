import React, { Component } from 'react';
import { ConfirmButton } from '../../Components/Button';
import $ from 'jquery';

export default class ResetPassword extends Component {
    constructor(props) {
        super(props);

        this.state = {
            requestPending: false
        };
    };

    resetPassword(account) {
        this.setState({
            requestPending: true
        }, () => {
            $.ajax({
                type: 'patch',
                url: `${this.props.baseUri}/${account.id}`
            }).done(() => {
                this.setState({
                    requestPending: false
                }, () => {
                    this.props.alert.success(`We've locked ${account.name}'s account. Reset instructions will be provided on next login.`);
                    this.props.u();
                });
            }).fail((err) => {
                this.props.alert(null, err.responseText);
            })
        });
    }

    render() {
        return (
            <ConfirmButton className="btn btn-dark mt-3 mx-1" pending={this.state.requestPending}
                cb={this.resetPassword.bind(this, this.props.account)}
            >
                Reset Password <i className="fas fa-user-lock" />
            </ConfirmButton>
        )
    }
}