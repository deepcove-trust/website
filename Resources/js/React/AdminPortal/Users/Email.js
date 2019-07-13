import React, { Component } from 'react';
import { Button } from '../../Components/Button';
import { FormGroup, Input } from '../../Components/FormControl';
import $ from 'jquery';

export default class Email extends Component {
    constructor(props) {
        super(props);

        this.state = {
            value: this.props.email,
            requestPending: false
        };
    }

    resetValue() {
        this.setState({ value: this.props.email || "" });
    }

    updateEmail() {
        if (!this.state.value)
            return;

        this.setState({ requestPending: true }, () => {
            $.ajax({
                method: 'put',
                url: `${this.props.baseUri}/${this.props.accountId}`,
                data: { email: this.state.value }
            }).done(() => {
                this.props.u();
                this.setState({ requestPending: false });
            }).fail((err) => {
                this.setState({ requestPending: false });
            });
        })
    }

    updateValue(x) {
        this.setState({ value: x });
    }

    render() {
        let btns;
        if (this.state.value != this.props.email && this.state.value !== "") {
            btns = (
                <div className="input-group-append">
                    <Button btnClass="btn btn-outline-success btn-sm" type="button" pending={this.state.requestPending} cb={this.updateEmail.bind(this)}>
                        <i className="fas fa-check"></i>
                    </Button>

                    <Button btnClass="btn btn-outline-danger btn-sm" type="button" cb={this.resetValue.bind(this)}>
                        <i className="fas fa-times"></i>
                    </Button>
                </div>
            )
        }

        return (
            <FormGroup>
                <label htmlFor={`email_user:${this.props.accountId}`}>Email</label>

                <div className="input-group">
                    <Input id={`email_user:${this.props.accountId}`} type="email" autoComplete="email" value={this.state.value} cb={this.updateValue.bind(this)} />

                    {btns}
                </div>
            </FormGroup>
        )
    }
}