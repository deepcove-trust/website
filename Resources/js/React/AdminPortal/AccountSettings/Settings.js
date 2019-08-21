import React, { Component, Fragment } from 'react';
import { Button } from '../../Components/Button';
import { FormGroup, Input } from '../../Components/FormControl';

import $ from 'jquery';


export default class Settings extends Component {
    constructor(props) {
        super(props);

        this.state = {
            requestPending: false,
            account: {
                id: null,
                email: null,
                phoneNumber: null
            },
            error: null
        }
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.account && nextProps.account != this.state.account) {
            this.setState({
                account: {
                    id: nextProps.account.id,
                    name: nextProps.account.name,
                    email: nextProps.account.email,
                    phoneNumber: nextProps.account.phoneNumber
                }
            });
        }
    }

    updateVal(field, val) {
        let account = this.state.account;
        switch (field) {
            case "name":
                account.name = val;
                break;

            case "email":
                account.email = val;
                break;

            case "phoneNumber":
                account.phoneNumber = val;
        }

        this.setState({
            account: account
        });
    }


    updateAccount(e) {
        e.preventDefault();

        this.setState({
            requestPending: true
        });

        $.ajax({
            type: 'post',
            url: `${this.props.baseUri}`,
            data: {
                id: this.state.account.id,
                name: this.state.account.name,
                email: this.state.account.email,
                phone: this.state.account.phoneNumber
            }
        }).done(() => {
            this.setState({
                requestPending: false
            });

            this.props.u();
        }).fail((err) => {
            this.setState({
                requestPending: false
            });

            console.error(`[Settings@updateAccount] Error updating account settings: `, err.responseText);
        })
    }

    render() {
        return (
            <Fragment>
                <form id="settings" onSubmit={this.updateAccount.bind(this)}>
                    <FormGroup label="Account Name" htmlFor="accountName" required>
                        <Input id="accountName"
                            type="text"
                            autoComplete="name"
                            value={this.state.account.name}
                            cb={this.updateVal.bind(this, 'name')}
                            required
                        />
                    </FormGroup>

                    <FormGroup label="Email" htmlFor="accountEmail" required>
                        <Input id="accountEmail"
                            type="email"
                            autoComplete="email"
                            value={this.state.account.email}
                            cb={this.updateVal.bind(this, 'email')}
                            required
                        />
                    </FormGroup>

                    <FormGroup label="Phone Number" htmlFor="accountPhone">
                        <Input id="accountPhone"
                            type="text"
                            value={this.state.account.phoneNumber}
                            autoComplete="phone"
                            cb={this.updateVal.bind(this, 'phoneNumber')}
                        />
                    </FormGroup>

                    <Button btnClass="btn btn-primary mt-4" pending={this.state.requestPending} type="submit">Update Settings</Button>
                </form>
            </Fragment>
        )
    }
}
