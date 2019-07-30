import React, { Component } from 'react';
import { FormGroup, TextArea } from '../../Components/FormControl';
import { Button } from '../../Components/Button';
import $ from 'jquery';

export default class MissionStatement extends Component {
    updateContactDetails(e) {
        e.preventDefaults();
    }

    render() {
        return (
            <form onSubmit={this.updateContactDetails.bind(this)}>
                <FormGroup htmlFor="facebook" label="Footer Mission Statement">
                    
                    <small className="text-muted">This mission statment will be displayed under the "Deep Cove Outdoor Education Trust" heading in the footer.</small>
                </FormGroup>

                <Button pending={false} type="submit">Update Mission Statement</Button>
            </form>
        )
    }
}