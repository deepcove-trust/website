import React, { Component } from 'react';
import { FormGroup, Input, Select, TextArea } from '../../Components/FormControl';
import { PageUrl } from '../../../helpers';
import $ from 'jquery';

export class PageDescription extends Component {
    render() {
        return (
            <FormGroup htmlFor="description" label="Page Description">
                <TextArea id="description"
                    rows={4}
                    maxLength={150}
                    value={this.props.value}
                    cb={this.props.cb}
                    placeHolder="This may be displayed in Google Search Results"
                />
            </FormGroup>    
        )
    }
}

export class PageName extends Component {
    constructor(props) {
        super(props);

        this.state = {
            currentName: this.props.value
        }
    }

    validatePageName(string) {
        this.props.cb(string);
        // This stops an error where the validator might
        // Stop them from keeping their page name
        if (string == this.state.currentName) {
            return;

            clearTimeout(this.inputTimer);
            this.inputTimer = setTimeout(() => {
                $.ajax({
                    method: 'post',
                    url: `/api/page/validate-name`,
                    data: { name: string }
                }).done(() => {
                    this.props.validationCb(null);
                }).fail((err) => {
                    console.log(err.responseText)
                    this.props.validationCb(err.responseText);
                });
            }, 1 * 1000);
        }
    }

    render() {
        return (
            <FormGroup htmlFor="name" label="Page Name:" required>
                <Input id="name"
                    type="text"
                    value={this.props.value}
                    cb={this.validatePageName.bind(this)}
                    required
                />

                <small className="text-danger">{this.props.errorText}</small>
            </FormGroup>
        )
    }
}

export class WebsiteSection extends Component {
    render() {
        return (
            <FormGroup htmlFor="section" label="Website Section:" required>
                <Select id="section"
                    options={this.props.options}
                    selected={this.props.value}
                    cb={this.props.cb}
                />
            </FormGroup> 
        )
    }
}


export class PreviewUrl extends Component {
    render() {
        return (
            <FormGroup label="Page URL:">
                <Input className="form-control-plaintext"
                    type="text"
                    value={PageUrl(this.props.page.name, this.props.page.section)}
                    disabled
                />
            </FormGroup>
        )
    }
}    