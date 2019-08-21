import React, { Component } from 'react';
import { FormGroup, Input } from '../../Components/FormControl';

export default class Phone extends Component {

    render() {
        let control;
        if (this.props.mode == "view") {
            control = <input className="form-control-plaintext" type="text" value={this.props.value} disabled />
        } else {
            control = <Input id={`phone_user:${this.props.accountId}`} type="text" autoComplete="phone" value={this.props.value} cb={this.props.cb} />    
        }

        return (
            <FormGroup label="Phone" htmlFor={`phone_user:${this.props.accountId}`}>
                {control}
            </FormGroup>
        )
    }
}