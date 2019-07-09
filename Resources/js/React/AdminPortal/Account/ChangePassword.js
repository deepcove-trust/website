import React, { Component } from 'react';
import Button from '../../Components/Button';
import { FormGroup, Input } from '../../Components/FormControl';

import $ from 'jquery';


export default class ChangePassword extends Component {
    constructor(props) {
        super(props);

        this.state = {
            requestPending: false,
            requestFailed: "",
            passwords: { 1: null, 2: null },
        }
    }

    passwordComparer(id, val) {
        let passwd = this.state.passwords;

        passwd = {
            1: id == 1 ? val : passwd[1],
            2: id == 2 ? val : passwd[2]
        };

        this.setState({ passwords: passwd });
    }

    passwordConditions() {
        let conditions = { label: "", disabled: true }

        // New password must be at least five characters
        if (this.state.passwords[1] && this.state.passwords[1].length > 5) {
            // Password and confirmation must match
            if (this.state.passwords[1] == this.state.passwords[2]) {
                conditions.disabled = false;
            } else {
                conditions.label = "Your new passwords do not match";
            }
        } else {
            conditions.label = "Password must be at least six characters"
        }

        return conditions;
    }

    updateAccountPassword(e) {
        e.preventDefault();
        this.setState({ requestPending: true });

        $.ajax({
            type: 'post',
            url: `${this.props.baseUri}/password`,
            data: $("#password").serialize()
        }).done(() => {
            let passwd = { 1: 0, 2: 0 };
            this.setState({ requestPending: false, requestFailed: "", passwords: passwd});
            $("#password").trigger("reset");
        }).fail((err) => {
            this.setState({ requestPending: false, requestFailed: err.responseText });
        });
    }

    render() {
        return (
            <form id="password" className="row pb-3" onSubmit={this.updateAccountPassword.bind(this)}>
                <div className="col-12">
                    <h4 className="text-center">Update Password</h4>
                    <p className="text-center">Option Password Reset</p>
                    <FormGroup>
                        <label htmlFor="currentPassword" className="required">Confirm Password</label>
                        <Input id="currentPassword"
                            type="password"
                            name="currentPassword"
                            autoComplete="password"
                        />
                    </FormGroup>
                </div>

                <div className="col-lg-6 col-sm-12">
                    <FormGroup>
                        <label htmlFor="newPassword" className="required">New Password</label>
                        <Input id="newPassword"
                            type="password"
                            name="newPassword"
                            autoComplete="newpassword"
                            cb={this.passwordComparer.bind(this, 1)}
                        />
                        <small className="text-danger">{this.passwordConditions().label}</small>
                        <small className="text-danger d-block">{this.state.requestFailed}</small>
                    </FormGroup>
                </div>

                <div className="col-lg-6 col-sm-12">
                    <FormGroup>
                        <label htmlFor="confirmPassword" className="required">Confirm New Password</label>
                        <Input id="confirmPassword"
                            type="password"
                            name="confirmPassword"
                            autoComplete="newpassword"
                            cb={this.passwordComparer.bind(this, 2)}
                        />
                    </FormGroup>
                </div>

                <Button btnClass="btn btn-warning d-block ml-auto mr-3" type="submit" disabled={this.passwordConditions().disabled} pending={this.state.requestPending}>Update Password</Button>
            </form>
        )
    }
}
