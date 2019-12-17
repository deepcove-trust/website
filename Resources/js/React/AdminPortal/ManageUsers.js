import React, { Component } from 'react';
import { render } from 'react-dom';
import AccountCard from './ManageUsers/AccountCard';
import { validateEmail } from '../../helpers';
import AlertWrapper from '../Components/Alert';
import $ from 'jquery';

const baseUri = `/admin/users`;

export default class Users extends Component {
    constructor(props) {
        super(props);

        this.state = {
            accounts: null,
            requestPending: false
        }
    }

    componentDidMount() {
        this.getData();
    }

    getData() {
        $.ajax({
            type: 'get',
            url: `${baseUri}/data`
        }).done((data) => {
            this.setState({ accounts: null }, () => {
                this.setState({ accounts: data });
            });
        }).fail((err) => {
            this.Alert.AlertWrapper('error', $.parseJSON(err.responseText))
        });
    }

    deleteUser(account) {
        this.setState({
            requestPending: true
        }, () => {
            $.ajax({
                type: 'delete',
                url: `${baseUri}/${account.id}`
            }).done(() => {
                this.setState({
                    requestPending: false
                }, () => {
                    this.getData();
                });

                this.Alert.success(`${account.name}\'s account has been deleted`);
            }).fail((err) => {
                this.setState({
                    requestPending: false
                }, this.Alert.error(null, err.responseText))
            });
        });
    }

    saveChanges(account) {
        // Validate email against RFC2822
        if (!validateEmail(account.email)) {
            this.Alert('error', {
                ui: 'Please enter a valid email',
                debug: 'email is not RFC2822 compliant.'
            });
        } else {
            $.ajax({
                type: 'put',
                url: `${baseUri}/${account.id}`,
                data: account
            }).done(() => {
                this.setState({
                }, this.Alert.success('Account settings updated'));
                this.getData();
            }).fail((err) => {
                this.Alert.error(null, err.responseText);
            });
        }
    }

    forcePasswordReset(account) {
        this.setState({
            requestPending: true
        }, () => {
            $.ajax({
                type: 'patch',
                url: `${baseUri}/${account.id}`
            }).done(() => {
                this.setState({
                    requestPending: false
                }, () => {
                    this.getData();
                    this.Alert.success('We\'ve sent a password reset email.')
                });
            }).fail((err) => {
                this.Alert.parseJSON('error', $.parseJSON(err.responseText));
            })
        });
    }

    render() {
        let accounts;
        if(this.state.accounts) {
            accounts = this.state.accounts.map((account, key) => {
                return <AccountCard account={account} key={key}
                    saveChanges={this.saveChanges.bind(this)}
                    deleteUser={this.deleteUser.bind(this)}
                    forceReset={this.forcePasswordReset.bind(this)}
                    requestPending={this.state.requestPending}
                />
            });
        }

        return (
            <AlertWrapper onRef={ref => (this.Alert = ref)}>
                <div className="row">
                    <div className="col-12 py-3">
                        <h1 className="text-center">Manage Users</h1>
                        <p className="text-center">
                            Active accounts have access to all functions, <a href="/register">click here</a> to register a new account.
                        </p>
                    </div>

                    {accounts}
                </div>
            </AlertWrapper>
        );
    }
}

if (document.getElementById('react_users'))
    render(<Users />, document.getElementById('react_users'));    