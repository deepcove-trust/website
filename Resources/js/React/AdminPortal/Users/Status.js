import React, { Component } from 'react';
import { FormGroup, Select } from '../../Components/FormControl';
import $ from 'jquery';

export default class Status extends Component {
    updateStatus(status) {
        $.ajax({
            type: 'put',
            url: `${this.props.baseUri}/${this.props.accountId}`,
            data: { status: status }
        }).done(() => {
            this.props.u();
        }).fail((err) => {
            console.error(`[Status@updateEmail] Error updating account status to ${status}: `, err.responseText);
        });
    }

    render() {
        return (
            <FormGroup label="Status" htmlFor={`status_user:${this.props.accountId}`}>
                <Select id={`status_user:${this.props.accountId}`} options={["Active", "Inactive"]} selected={this.props.active ? "Active" : "Inactive"} cb={this.updateStatus.bind(this)}/>
            </FormGroup>
        )
    }
}