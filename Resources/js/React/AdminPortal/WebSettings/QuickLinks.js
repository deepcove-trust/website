import React, { Component } from 'react';
import { Input, FormGroup } from '../../Components/FormControl';
import { Button } from '../../Components/Button';
import $ from 'jquery';

export default class QuickLinks extends Component {
    updateContactDetails(e) {
        e.preventDefaults();
    }

    render() {
        return (
            <form onSubmit={this.updateContactDetails.bind(this)}>
                <h4>Footer Contact Buttons</h4>
                <FormGroup htmlFor="facebook" label="Facebook Url:">
                    <Input type="url" id="facebook" autoComplete="url" name="facebook" />
                    <small className="text-muted">Leaving this field blank will disable the Facebook button.</small>
                </FormGroup>

                <FormGroup htmlFor="email" label="Contact Email:" required>
                    <Input type="email" id="email" autoComplete="email" name="email" required />
                </FormGroup>

                <FormGroup htmlFor="phone" label="Contact Phone:">
                    <Input type="text" id="phone" autoComplete="phone" name="phone" />
                    <small className="text-muted">Leaving this field blank will disable the call us button.</small>
                </FormGroup>

                <Button pending={false} type="submit">Update Contact Details</Button>
            </form>
        )
    }
}