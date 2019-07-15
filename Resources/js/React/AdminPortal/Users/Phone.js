import React, { Component } from 'react';
import { Button } from '../../Components/Button';
import { FormGroup, Input } from '../../Components/FormControl';
import $ from 'jquery';

export default class Phone extends Component {
    constructor(props) {
        super(props);

        this.state = {
            value: this.props.phone,
            requestPending: false
        };
    }

    resetValue() {
        this.setState({
            value: this.props.phone || ""
        });
    }

    updatePhone() {
        if (!this.state.value)
            return;

        this.setState({ requestPending: true }, () => {
            $.ajax({
                method: 'put',
                url: `${this.props.baseUri}/${this.props.accountId}`,
                data: { phone: this.state.value }
            }).done(() => {
                this.props.u();

                this.setState({
                    requestPending: false
                });
            }).fail((err) => {
                console.error(`[Phone@updatePhone] Error updating phone number: `, err.responseText);

                this.setState({
                    requestPending: false
                });
            });
        })
    }

    updateValue(x) {
        this.setState({
            value: x
        });
    }

    render() {
        let btns;
        if (this.state.value != this.props.phone && this.state.value !== "") {
            btns = (
                <div className="input-group-append">
                    <Button btnClass="btn btn-outline-success btn-sm" type="button" pending={this.state.requestPending} cb={this.updatePhone.bind(this)}>
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
                <label htmlFor={`phone_user:${this.props.accountId}`}>Phone</label>
                
                <div className="input-group">
                    <Input id={`phone_user:${this.props.accountId}`} type="text" autoComplete="phone" value={this.state.value} cb={this.updateValue.bind(this)} />    
                    
                    {btns}
                </div>
            </FormGroup>
        )
    }
}