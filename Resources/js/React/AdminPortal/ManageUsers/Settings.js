import React, { Component } from 'react';
import { FormGroup, Input, Select } from '../../Components/FormControl';

export class Phone extends Component {

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

export class Email extends Component {

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

export class Status extends Component {

    callback(e) {
        this.props.cb(e.toLowerCase() == 'active');
    }

    getVal() {
        return this.props.value ? "Active" : "Inactive";
    }

    render() {
        let control;
        if (this.props.mode == "view") {
            control = <input className="form-control-plaintext" type="text" value={this.getVal()} disabled />
        } else {
            control = <Select id={`status_user:${this.props.accountId}`}
                options={["Active", "Inactive"]}
                selected={this.getVal()}
                cb={this.callback.bind(this)}
            />
        }

        return (
            <FormGroup label="Status" htmlFor={`status_user:${this.props.accountId}`}>
                {control}
            </FormGroup>
        )
    }
}