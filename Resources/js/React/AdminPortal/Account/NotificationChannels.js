import React, { Component, Fragment } from 'react';
import { FormGroup, Input } from '../../Components/FormControl';
import Alert from '../../Components/Alert';
import $ from 'jquery';

export default class NotificationChannels extends Component {
    render() {
        return (
            <Fragment>
                <p className="text-center">Send me emails when...</p>
                <Alert type="primary">This feature is not yet implemented</Alert>
                <div className="custom-control custom-checkbox">
                    <input type="checkbox" class="custom-control-input" id="customCheck" name="example1" />
                    <label className="custom-control-label" for="customCheck">Email type name</label>
                </div>
            </Fragment>
        )
    }
}