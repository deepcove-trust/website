import React, { Component } from 'react';
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
        this.setState({ requestPending: true });

        $.ajax({
            type: 'post',
            url: `${this.props.baseUri}`,
            data: $("#settings").serialize()
        }).done(() => {
            this.setState({ requestPending: false });
            this.props.u();
        }).fail((err) => {
            this.setState({ requestPending: false });
        })
    }

    render() {
        return (
            <form id="settings" onSubmit={this.updateAccount.bind(this)}>
                <FormGroup>
                    <label htmlFor="accountName" className="required">Account Name</label>
                    <Input id="accountName"
                        type="text"
                        name="name"
                        autoComplete="name"
                        value={this.props.account ? this.props.account.name : null}
                        required="true"
                    />
                </FormGroup>

                <FormGroup>
                    <label htmlFor="accountEmail" className="required">Email</label>
                    <Input id="accountEmail"
                        type="email"
                        name="email"
                        autoComplete="email"
                        value={this.props.account ? this.props.account.email : null}
                        required="true"
                    />
                </FormGroup>

                <FormGroup>
                    <label htmlFor="accountPhone">Phone Number</label>
                    <Input id="accountPhone"
                        type="text"
                        name="phone"
                        value={this.props.account ? this.props.account.phoneNumber : null}
                        autoComplete="phone"
                    />
                </FormGroup>

                <Button btnClass="btn btn-primary" pending={this.state.requestPending} type="submit">Update Settings</Button>
            </form>
        )
    }
}
