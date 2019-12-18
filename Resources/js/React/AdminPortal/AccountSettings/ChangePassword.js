import React, { Component } from 'react';
import { Button } from '../../Components/Button';
import { FormGroup, Input } from '../../Components/FormControl';
import Alert from '../../Components/Alert';

import $ from 'jquery';


export default class ChangePassword extends Component {
    constructor(props) {
        super(props);

        this.state = {
            requestPending: false,
            inputs: { current: "", new: "", confirm: "" },
        }
    }

    updateVal(id, val) {
        let inputs = this.state.inputs;
        inputs[id] = val;
        
        this.setState({
            inputs
        });
    }

    passwordConditions() {
        let conditions = { label: "", disabled: true }

        // New password must be at least five characters
        if (this.state.inputs['new'] && this.state.inputs['new'].length > 5) {
            // Password and confirmation must match
            if (this.state.inputs['new'] == this.state.inputs['confirm']) {
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

        this.setState({
            requestPending: true
        });

        $.ajax({
            type: 'post',
            url: `${this.props.baseUri}/password`,
            data: this.state.inputs
        }).done(() => {
            this.setState({
                requestPending: false,
                inputs: { current: "", new: "", confirm: "" }
            }, this.Alert.success('Your password has been updated'));

            this.props.u();
        }).fail((err) => {
            this.setState({
                requestPending: false                
            }, this.Alert.error(null, err.responseText));
        });
    }

    render() {
        return (
            <Alert onRef={ref => (this.Alert = ref)}>
                <form id="password" onSubmit={this.updateAccountPassword.bind(this)}>
                
                    <FormGroup label="Your Current Password" htmlFor="currentPassword" required>
                        <Input id="currentPassword"
                            type="password"
                            name="currentPassword"
                            value={this.state.inputs['current']}
                            autoComplete="password"
                            cb={this.updateVal.bind(this, 'current')}
                            required
                        />
                    </FormGroup>
                
                    <FormGroup label="New Password" htmlFor="newPassword" required>
                        <Input id="newPassword"
                            type="password"
                            name="newPassword"
                            value={this.state.inputs['new']}
                            autoComplete="newpassword"
                            cb={this.updateVal.bind(this, 'new')}
                            required
                        />
                    </FormGroup>
            
                    <FormGroup label="Confirm New Password" htmlFor="confirmPassword" required>
                        <Input id="confirmPassword"
                            type="password"
                            name="confirmPassword"
                            value={this.state.inputs['confirm']}
                            autoComplete="newpassword"
                            cb={this.updateVal.bind(this, 'confirm')}
                            required
                        />

                        <small className="text-danger">{this.passwordConditions().label}</small>
                    </FormGroup>   

                    <Button className="btn btn-primary d-block" type="submit" disabled={this.passwordConditions().disabled} pending={this.state.requestPending}>Update Password</Button>
                </form>
            </Alert>
        )
    }
}
