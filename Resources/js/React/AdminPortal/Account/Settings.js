import React, { Component, Fragment } from 'react';
import { Button } from '../../Components/Button';
import { FormGroup, Input } from '../../Components/FormControl';

import $ from 'jquery';


export default class Settings extends Component {
    constructor(props) {
        super(props);

        this.state = {
            requestPending: false
        }
    }

    updateAccount(e) {
        e.preventDefault();

        this.setState({
            requestPending: true
        });

        $.ajax({
            type: 'post',
            url: `${this.props.baseUri}`,
            data: $("#settings").serialize()
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
                            name="name"
                            autoComplete="name"
                            value={this.props.account ? this.props.account.name : null}
                            required
                        />
                    </FormGroup>

                    <FormGroup label="Email" htmlFor="accountEmail" required>
                        <Input id="accountEmail"
                            type="email"
                            name="email"
                            autoComplete="email"
                            value={this.props.account ? this.props.account.email : null}
                            required
                        />
                    </FormGroup>

                    <FormGroup label="Phone Number" htmlFor="accountPhone">
                        <Input id="accountPhone"
                            type="text"
                            name="phone"
                            value={this.props.account ? this.props.account.phoneNumber : null}
                            autoComplete="phone"
                        />
                    </FormGroup>

                    <Button btnClass="btn btn-primary mt-4" pending={this.state.requestPending} type="submit">Update Settings</Button>
                </form>
            </Fragment>
        )
    }
}
