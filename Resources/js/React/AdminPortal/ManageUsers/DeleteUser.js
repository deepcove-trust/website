import React, { Component } from 'react';
import { ConfirmButton } from '../../Components/Button';
import $ from 'jquery';

export default class DeleteUser extends Component {
    constructor(props) {
        super(props);

        this.state = {
            requestPending: false
        };
    };

    deleteUser(account) {
        this.setState({
            requestPending: true
        }, () => {
            $.ajax({
                type: 'delete',
                url: `${this.props.baseUri}/${account.id}`
            }).done(() => {
                this.setState({
                    requestPending: false
                }, () => {
                    this.props.u(account);
                    this.props.alert.success(`${account.name}\'s account has been deleted`);
                });
            }).fail((err) => {
                this.setState({
                    requestPending: false
                }, this.alert.error(null, err.responseText))
            });
        });
    }

    render() {
        return (
            <ConfirmButton className="btn btn-danger mt-3" pending={this.state.requestPending}
                cb={this.deleteUser.bind(this, this.props.account)}
            >
                Delete User <i className="fas fa-user-times" />
            </ConfirmButton>
        )
    }
}