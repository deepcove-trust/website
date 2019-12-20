import React, { Component } from 'react';
import { FormGroup, Input, TextArea } from '../../Components/FormControl';
import { PrepareGoogleMapsUrl } from '../../../helpers';
import { Button } from '../../Components/Button';
import Alert from '../../Components/Alert';
import $ from 'jquery';
import _ from 'lodash';

const baseUri = "/admin/settings/contact"

export default class ContactInformation extends Component {
    constructor(props) {
        super(props);

        this.state = {
            contact: {
                emailGeneral: "",
                emailBookings: "",
                missionStatment: "",
                phone: "",
                urlFacebook: "",
                urlGooglePlay: "",
                urlGoogleMaps: "",
            },
            requestPending: false
        }
    }

    componentDidMount() {
        this.getData();
    }

    getData() {
        $.ajax({
            method: 'get',
            url: baseUri
        }).done((contact) => {
            this.setState({
                contact: contact
            });
        }).fail((err) => {
            console.err(err);
        });
    }

    updateState(field, val) {
        let contact = this.state.contact;
        contact[field] = val;

        this.setState({
            contact
        });
    }

    submitForm(e) {
        e.preventDefault();

        this.setState({
            requestPending: true
        }, () => {
            $.ajax({
                type: 'post',
                url: `${baseUri}`,
                data: this.state.contact,
            }).done(() => {
                this.setState({
                    requestPending: false
                }, () => this.Alert.success('Website settings updated'));

                this.getData();
            }).fail((err) => {
                this.Alert.error(null, err.responseText);
            });
        })
    }

    render() {
        return (
            <Alert onRef={ref => (this.Alert = ref)}>
                <form className="row" onSubmit={this.submitForm.bind(this)}>
                    <div className="col-lg-6 col-md-12">
                        <GeneralEmail email={this.state.contact.emailGeneral}
                            cb={this.updateState.bind(this, 'emailGeneral')}
                        />

                        <BookingEmail email={this.state.contact.emailBookings}
                            cb={this.updateState.bind(this, 'emailBookings')}
                        />

                        <Phone number={this.state.contact.phone}
                            cb={this.updateState.bind(this, 'phone')}
                        />

                        <MissionStatment text={this.state.contact.missionStatement}
                            cb={this.updateState.bind(this, 'missionStatement')}
                        />
                    </div>

                    <div className="col-lg-6 col-md-12">
                        <UrlFacebook url={this.state.contact.urlFacebook}
                            cb={this.updateState.bind(this, 'urlFacebook')}
                        />

                        <UrlGooglePlay url={this.state.contact.urlGooglePlay}
                            cb={this.updateState.bind(this, 'urlGooglePlay')}
                        />

                        <UrlGoogleMap url={this.state.contact.urlGoogleMaps}
                            cb={this.updateState.bind(this, 'urlGoogleMaps')}
                        />

                        <FormGroup label="&#8291;">
                            <Button className="btn btn-dark d-block" type="submit" pending={this.state.requestPending}>
                                Update Settings <i className="fas fa-check-circle"></i>
                            </Button>
                        </FormGroup>

                    </div>
                </form>
            </Alert>
        )
    }
}

export class GeneralEmail extends Component {
    render() {
        return (
            <FormGroup htmlFor="email.general" label="Email: (General Enquiries)" required>
                <Input id="email.general" type="email" value={this.props.email} cb={this.props.cb.bind(this)}/>
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
            <FormGroup htmlFor="email.bookings" label="Email: (Booking Enquiries)" required>
                <Input id="email.bookings" type="email" value={this.props.email} cb={this.props.cb.bind(this)}/>
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
            <FormGroup htmlFor="mission" label="Mission Statement" required>
                <TextArea id="mission" maxLength="200" value={this.props.text} cb={this.props.cb.bind(this)} rows={3} />
            </FormGroup>
        ) 
    }
}

export class Phone extends Component {
    render() {
        return (
            <FormGroup htmlFor="phone" label="Phone:">
                <Input id="phone" type="phone" value={this.props.number} cb={this.props.cb.bind(this)}/>
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
            <FormGroup htmlFor="url.facebook" label="Facebook Page URL:">
                <Input id="url.facebook" type="url" value={this.props.url} cb={this.props.cb.bind(this)} placeHolder="e.g. https://example.com"/>
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
            <FormGroup htmlFor="url.googleplay" label="Discover Deep Cove - App URL:">
                <Input id="url.googleplay" type="url" value={this.props.url} cb={this.props.cb.bind(this)} placeHolder="e.g. https://example.com"/>
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
            <FormGroup htmlFor="url.googleMaps" label="Google Maps - URL">
                <Input id="url.googleMaps" type="url" value={this.props.url} cb={this.handleInput.bind(this)}/>
                <small className="text-muted pl-2">
                    Used for the map of the contact us page
                </small>
            </FormGroup>
        )
    }
}