import React, { Component, Fragment } from 'react';
import $ from 'jquery';
import _ from 'lodash';
import { FormGroup, Input } from '../../Components/FormControl';

export default class ContactInformation extends Component {
    render() {
        return (
            <div className="row">
                <div className="col-lg-6 col-md-12">
                    <FormGroup label="Email: (General Enquiries)">
                        <Input type="url" />
                        <small className="text-muted pl-2">
                            <i class="fas fa-envelope"></i> Used by the contact us email form, the footer &amp; in the emails.
                        </small>
                    </FormGroup>

                    <FormGroup label="Email: (Booking Enquiries)">
                        <Input type="url" />
                        <small className="text-muted pl-2">
                            Used by the contact us form.
                        </small>
                    </FormGroup>

                    <FormGroup label="Phone:">
                        <Input type="phone" />
                        <small className="text-muted pl-2">
                            <i className="fas fa-phone"></i> Used in the footer &amp; in emails.
                        </small>
                    </FormGroup>
                </div>

                <div className="col-lg-6 col-md-12">
                    <FormGroup label="Facebook Page URL:">
                        <Input type="url" />
                        <small className="text-muted pl-2">
                            <i class="fab fa-facebook-square"></i> Used in the footer &amp; in emails.
                        </small>
                    </FormGroup>
                    
                    <FormGroup label="Discover Deep Cove - App URL:">
                        <Input type="url" />
                        <small className="text-muted pl-2">
                            <i className="fab fa-google-play"></i> Used in the footer &amp; in emails.
                        </small>
                    </FormGroup>
                </div>
            </div>
        )
    }
}