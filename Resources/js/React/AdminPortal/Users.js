import React, { Component } from 'react';
import { render } from 'react-dom';
import AccountCard from './Users/AccountCard';
import $ from 'jquery';


const baseUri = `/admin-portal/users`;

export default class Users extends Component {
    constructor(props) {
        super(props);

        this.state = {
            accounts: null,
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
            console.error(`[User@getData] Error getting data: `, err.responseText);
        })
    }

    render() {
        let accounts;
        if(this.state.accounts) {
            accounts = this.state.accounts.map((account, key) => {
                return <AccountCard account={account}
                    u={this.getData.bind(this)}
                    baseUri={baseUri}
                />
            });
        }

        return (
            <div className="row">
                <div className="col-12">
                    <h1 className="text-center">Users</h1>
                    <p className="text-center">
                        Active accounts have access to all functions, <a href="/register">click here</a> to register a new account.
                    </p>
                </div>

                {accounts}
            </div>
        );
    }
}

if (document.getElementById('react_users'))
    render(<Users />, document.getElementById('react_users'));    