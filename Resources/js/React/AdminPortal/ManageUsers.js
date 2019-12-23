import React, { Component } from 'react';
import { render } from 'react-dom';
import AccountCard from './ManageUsers/AccountCard';
import Alert from '../Components/Alert';
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
            this.Alert.Alert('error', $.parseJSON(err.responseText))
        });
    }

    render() {
        let accounts;
        if(this.state.accounts) {
            accounts = this.state.accounts.map((account, key) => {
                return <AccountCard key={key}
                    u={this.getData.bind(this)}
                    account={account} 
                    baseUri={baseUri}
                    alert={this.Alert}
                />
            });
        }

        return (
            <Alert onRef={ref => (this.Alert = ref)}>
                <div className="row">
                    <div className="col-12 py-3">
                        <h1 className="text-center">Manage Users</h1>
                        <p className="text-center">
                            Active accounts have access to all functions, <a href="/register">click here</a> to register a new account.
                        </p>
                    </div>

                    {accounts}
                </div>
            </Alert>
        );
    }
}

if (document.getElementById('react_users'))
    render(<Users />, document.getElementById('react_users'));    