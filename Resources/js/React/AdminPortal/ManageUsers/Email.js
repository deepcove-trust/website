import React, { Component } from 'react';
import { FormGroup, Input } from '../../Components/FormControl';

export default class Email extends Component {

    render() {
        let control;
        if (this.props.mode == "view") {
            control = <input className="form-control-plaintext" type="text" value={this.props.value} disabled />
        } else {
            control = <Input id={`email_user:${this.props.accountId}`} type="email" autoComplete="email" value={this.props.value} cb={this.props.cb} />
        }

        return (
            <FormGroup label="Email" htmlFor={`email_user:${this.props.accountId}`} required>
                {control}
            </FormGroup>
        )
    }
}