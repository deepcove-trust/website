import React, { Component, Fragment } from 'react';
import { Checkbox, FormGroup, Input, TextArea } from '../../Components/FormControl';

export class MessageBody extends Component {
    render() {
        return (

            
                
            <FormGroup htmlFor="message" label="Message:" className="col-12" required>
                <TextArea id="message"
                    rows={5}
                    maxLength="800"
                    value={this.props.value}
                    cb={this.props.cb}
                    required
                />

                {this.props.children}
            </FormGroup>
        )
    }
}

export class SendToBookings extends Component {
    render() {
        return (
            <FormGroup className="col-12">
                <Checkbox id="bookings"
                    label="Please send this email to the bookings team"
                    checked={this.props.value}
                    cb={this.props.cb}
                />
            </FormGroup>
        )
    }
}

export class Subject extends Component {
    render() {
        return (
            <FormGroup htmlFor="subject" label="Subject:" className="col-12" required>
                <Input id="subject"
                    type="text"
                    value={this.props.value}
                    cb={this.props.cb}
                    required
                />
            </FormGroup>
        )
    }
}