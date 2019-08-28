import React, { Component } from 'react';
import { FormGroup, Input } from '../../Components/FormControl';

export class Email extends Component {
    render() {
        return (
            <FormGroup htmlFor="email" label="Email:" className="col-lg-6 col-md-6 col-sm-12" required>
                <Input id="email"
                    type="email"
                    value={this.props.value}
                    autoComplete="email"
                    cb={this.props.cb}
                    required
                />
            </FormGroup>
        )
    }
}

export class Phone extends Component {
    render() {
        return (
            <FormGroup htmlFor="phone" label="Phone Number:" className="col-lg-6 col-md-6 col-sm-12">
                <Input id="phone"
                    type="text"
                    value={this.props.value}
                    autoComplete="phone"
                    cb={this.props.cb}
                />
            </FormGroup>
        )
    }
}