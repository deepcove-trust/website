import React, { Component } from 'react';
import { FormGroup, Input, TextArea } from '../../Components/FormControl';
import { PrepareGoogleMapsUrl } from '../../../helpers';
import { Button } from '../../Components/Button';
import $ from 'jquery';
import _ from 'lodash';



export default class ContactInformation extends Component {
    constructor(props) {
        super(props);

        this.state = {
            contact: this.props.contact,
            requestPending: false
        }
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.contact != this.state.contact) {
            this.setState({
                contact: nextProps.contact
            });
        }
    }

    updateState(field, val) {
        let contact = this.state.contact;
        switch (field) {
            case "email.general":
                contact.email.general = val;
                break;
            case "email.bookings":
                contact.email.bookings = val;
                break;
            case "phone":
                contact.phone = val;
                break;
            case "url.facebook":
                contact.urls.facebook = val;
                break;
            case "url.googlePlay":
                contact.urls.googlePlay = val;
                break;
            case "url.googleMaps":
                contact.urls.googleMaps = val;
                break;
            case "missionStatement":
                contact.missionStatement = val;
        }

        this.setState({
            contact: contact
        });
    }

    submitForm(e) {
        e.preventDefault();

        this.setState({
            requestPending: true
        }, () => {
                $.ajax({
                    type: 'post',
                    url: `${this.props.baseUri}/contact`,
                    data: {
                        emailGeneral: this.state.contact.email.general,
                        emailBookings: this.state.contact.email.bookings,
                        phone: this.state.contact.phone,
                        urlFacebook: this.state.contact.urls.facebook,
                        urlGooglePlay: this.state.contact.urls.googlePlay,
                        urlGoogleMaps: this.state.contact.urls.googleMaps,
                        missionStatement: this.state.contact.missionStatement
                    }
                }).done(() => {
                    this.props.u();

                    this.setState({
                        requestPending: false
                    });
                }).fail((err) => {
                    console.error(`[ContactInformation@submitForm] Error updating site settings (contact information): `, err.responseText);
                });
        })
    }

    render() {
        return (
            <form className="row" onSubmit={this.submitForm.bind(this)}>
                <div className="col-lg-6 col-md-12">
                    <GeneralEmail email={this.state.contact.email.general}
                        cb={this.updateState.bind(this, 'email.general')}
                    />

                    <BookingEmail email={this.state.contact.email.bookings}
                        cb={this.updateState.bind(this, 'email.bookings')}
                    />

                    <Phone number={this.state.contact.phone}
                        cb={this.updateState.bind(this, 'phone')}
                    />

                    <MissionStatment text={this.state.contact.missionStatement}
                        cb={this.updateState.bind(this, 'missionStatement')}
                    />
                </div>

                <div className="col-lg-6 col-md-12">
                    <UrlFacebook url={this.state.contact.urls.facebook}
                        cb={this.updateState.bind(this, 'url.facebook')}
                    />

                    <UrlGooglePlay url={this.state.contact.urls.googlePlay}
                        cb={this.updateState.bind(this, 'url.googlePlay')}
                    />

                    <UrlGoogleMap url={this.state.contact.urls.googleMaps}
                        cb={this.updateState.bind(this, 'url.googleMaps')}
                    />

                    <FormGroup label="&#8291;">
                        <Button className="btn btn-dark d-block" type="submit" pending={this.state.requestPending}>
                            Update Settings <i className="fas fa-check-circle"></i>
                        </Button>
                    </FormGroup>

                </div>
            </form>
        )
    }
}

export class GeneralEmail extends Component {
    render() {
        return (
            <FormGroup label="Email: (General Enquiries)" required>
                <Input type="email" value={this.props.email} cb={this.props.cb.bind(this)}/>
                <small className="text-muted pl-2">
                    <i className="fas fa-envelope"></i> Used by the contact us email form, the footer &amp; in the emails.
                </small>
            </FormGroup>
        )
    }
}

export class BookingEmail extends Component {
    render() {
        return (
            <FormGroup label="Email: (Booking Enquiries)" required>
                <Input type="email" value={this.props.email} cb={this.props.cb.bind(this)}/>
                <small className="text-muted pl-2">
                    Used by the contact us form.
                </small>
            </FormGroup> 
        )
    }
}

export class MissionStatment extends Component {
    render() {
        return (
            <FormGroup label="Mission Statement" required>
                <TextArea maxLength="200" value={this.props.text} cb={this.props.cb.bind(this)} rows={3} />
            </FormGroup>
        ) 
    }
}

export class Phone extends Component {
    render() {
        return (
            <FormGroup label="Phone:">
                <Input type="phone" value={this.props.number} cb={this.props.cb.bind(this)}/>
                <small className="text-muted pl-2">
                    <i className="fas fa-phone"></i> Used in the footer &amp; in emails.
                </small>
            </FormGroup>
        )
    }
}

export class UrlFacebook extends Component {
    render() {
        return (
            <FormGroup label="Facebook Page URL:">
                <Input type="url" value={this.props.url} cb={this.props.cb.bind(this)} placeHolder="e.g. https://example.com"/>
                <small className="text-muted pl-2">
                    <i className="fab fa-facebook-square"></i> Used in the footer &amp; in emails.
                </small>
            </FormGroup>
        )
    }
}

export class UrlGooglePlay extends Component {
    render() {
        return (
            <FormGroup label="Discover Deep Cove - App URL:">
                <Input type="url" value={this.props.url} cb={this.props.cb.bind(this)} placeHolder="e.g. https://example.com"/>
                <small className="text-muted pl-2">
                    <i className="fab fa-google-play"></i> Used in the footer &amp; in emails.
                </small>
            </FormGroup>
        )
    }
}

export class UrlGoogleMap extends Component {
    handleInput(i) {
        this.props.cb(PrepareGoogleMapsUrl(i));
    }

    render() {
        return (
            <FormGroup label="Google Maps - URL">
                <Input type="url" value={this.props.url} cb={this.handleInput.bind(this)}/>
                <small className="text-muted pl-2">
                    Used for the map of the contact us page
                </small>
            </FormGroup>
        )
    }
}