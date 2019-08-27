import React, { Component } from 'react';
import { FormGroup, Input } from '../../Components/FormControl';

export class Name extends Component {
    render() {
        return (    
            <FormGroup htmlFor="name" label="Your Name:" className="col-lg-6 col-md-6 col-sm-12" required>
                <Input id="name"
                    type="text"
                    value={this.props.value}
                    autoComplete="name"
                    cb={this.props.cb}
                    required
                />
            </FormGroup>
        )
    }
}

export class Org extends Component {
    render() {
        return (
            <FormGroup htmlFor="org" label="Organization:" className="col-lg-6 col-md-6 col-sm-12">
                <Input id="org"
                    type="text"
                    value={this.props.value}
                    autoComplete="organization"
                    cb={this.props.cb}
                />
            </FormGroup>
        )
    }
}