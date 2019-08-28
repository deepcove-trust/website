import React, { Component } from 'react';
import { FormGroup, Select } from '../../Components/FormControl';

export default class Status extends Component {

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