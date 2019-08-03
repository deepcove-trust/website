import React, { Component } from 'react';
import { Input, FormGroup, TextArea } from '../../Components/FormControl';
import { Button } from '../../Components/Button';
import $ from 'jquery';

export class ContactMission extends Component {
    constructor(props) {
        super(props);

        this.state = {
            pending: false,
            settings: {
                facebook: "",
                email: "",
                phone: "",
                footerText: ""
            }
        }
    }

    updateState(key, value) {
        console.log(`key: ${key} | Value: ${value}`)
        let settings = this.state.settings;
        switch (key) {
            case 'facebook':
                settings.facebook = value;
                break;
            case 'phone':
                settings.phone = value;
                break;
            case 'email':
                settings.email = value;
                break;
            case 'footerText':
                settings.footerText = value;
                break;
        }

        this.setState({
            settings: settings
        });
    }

    componentWillReceiveProps(nextProps) {
        if(nextProps.settings != this.state.settings)
            this.setState({ settings: nextProps.settings });
    }

    submitForm(e) {
        e.preventDefault();

        this.setState({
            pending: true
        }, () => {
            $.ajax({
                type: 'post',
                url: this.props.baseUri,
                data: this.state.settings
            }).done(() => {
                // Refresh the page so
                // we see the footer update.
                location.reload();
            }).fail((err) => {
                console.log(err.responseText);
            })
        });

    }

    render() {
        return (
            <form className="row" onSubmit={this.submitForm.bind(this)}>
                <div className="col-lg-6 col-sm-12">
                    <FormGroup htmlFor="facebook" label="Facebook Url:">
                        <Input type="url"
                            id="facebook"
                            autoComplete="url"
                            cb={this.updateState.bind(this, 'facebook')}
                            value={this.state.settings.facebookUrl}
                        />
                        <small className="text-muted">Leaving this field blank will disable the Facebook button.</small>
                    </FormGroup>

                    <FormGroup htmlFor="email" label="Contact Email:" required>
                        <Input type="email"
                            id="email"
                            autoComplete="email"
                            cb={this.updateState.bind(this, 'email')}
                            value={this.state.settings.email}
                            required
                        />
                    </FormGroup>

                    <Button pending={this.state.pending} type="submit">Update Settings</Button>
                </div>

                <div className="col-lg-6 col-sm-12">
                    <FormGroup htmlFor="phone" label="Contact Phone:">
                        <Input type="text"
                            id="phone"
                            autoComplete="phone"
                            cb={this.updateState.bind(this, 'phone')}
                            value={this.state.settings.phone}
                        />
                        <small className="text-muted">Leaving this field blank will disable the call us button.</small>
                    </FormGroup>

                    <FormGroup htmlFor="footerText" label="Footer Text:">
                        <TextArea id="footerText"
                            cb={this.updateState.bind(this, 'footerText')}
                            value={this.state.settings.footerText}
                        />
                        <small className="text-muted">This footer text displays in the top right coerner of the footer.</small>
                    </FormGroup>
                </div>
            </form>
        )
    }
}