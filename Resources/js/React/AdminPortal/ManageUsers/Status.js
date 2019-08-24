import React, { Component } from 'react';
import { FormGroup, Select } from '../../Components/FormControl';

export default class Status extends Component {

    render() {
        let control;
        if (this.props.mode == "view") {
            control = <input className="form-control-plaintext" type="text" value={this.props.value} disabled />
        } else {
            control = <Select id={`status_user:${this.props.accountId}`} options={["Active", "Inactive"]} selected={this.props.value} cb={this.props.cb} />
        }

        return (
            <FormGroup label="Status" htmlFor={`status_user:${this.props.accountId}`}>
                {control}
            </FormGroup>
        )
    }
}