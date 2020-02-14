import React, { Component } from 'react';
import { render } from 'react-dom';
import Alert from '../js/React/Components/Alert';
import $ from 'jquery';
import AccountCard from './UserAccounts/AccountCard';
const baseUrl = "/admin/users";

export default class UserAccounts extends Component {
    constructor(props) {
        super(props);

        this.state = {
            accounts: []
        }
    }

    componentDidMount() {
        this._getData();
    }

    _getData() {
        $.ajax({
            method: 'get',
            url: `${baseUrl}/data`
        }).done((accounts) => {
            this.setState({
                accounts
            });
        }).fail((err) => {
            this.Alert.error("Error fetching the user accounts list");
        })
    }

    render() {
        let accountCards = this.state.accounts.map((account, key) => {
            return <AccountCard account={account}
                Alert={this.Alert} key={key} baseUrl={baseUrl}
                updateData={this._getData.bind(this)}
            />;
        });

        return (
            <Alert onRef={(alert) => this.Alert = alert}>
                <div className="pt-3 text-center">
                    <h1>User Accounts</h1>
                    <p>Active accounts have access to all functions, <a href="/register">click here</a> to register a new account.</p>
                </div>

                <div className="row">
                    {accountCards}
                </div>
            </Alert>
        )
    }
}

if (document.getElementById('react_userAccounts'))
    render(<UserAccounts />, document.getElementById('react_userAccounts')); 