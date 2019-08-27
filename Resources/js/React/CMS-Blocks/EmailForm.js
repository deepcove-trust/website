import React, { Component, Fragment } from 'react';
import { FormGroup, Input, TextArea } from '../Components/FormControl';
import { Button } from '../Components/Button';
import Recaptcha from 'react-recaptcha';
import $ from 'jquery';


export default class EmailForm extends Component {
    constructor(props) {
        super(props);

        this.state = {
            mailSent: false
        }
    }

    render() {
        if (this.state.mailSent) {
            return <MailSent />
        } else {
            return <Form config={this.props.config}
                sent={() =>
                {
                    this.setState({
                        mailSent: true
                    });
                }}
            />
        }
    }
}

class MailSent extends Component {
    render() {
        return (
            <Fragment>
                <div className="fade1sec text-dark text-center mt-5 pt-5">
                    <i className="fas fa-check-circle pb-3 fa-5x"></i>
                    <h5 className="display-4 mb-2" style={{ 'font-size': 'xx-large' }}>Thanks for the Email!</h5>
                </div>
            </Fragment>
        )
    }
}


class Form extends Component {
    constructor(props) {
        super(props);

        this.state = {
            requestPending: false,
            mail: {
                name: null,
                email: null,
                phone: null,
                org: null,
                subject: null,
                message: null,
                code: null
            },
            key: false,
        }
    }


    componentDidUpdate() {
        if (!!this.props.config && !this.state.key) {
            this.setState({
                key: true
            });
        }
    }

    sendMail(e) {
        e.preventDefault();

        if (!this.state.mail.code) {
            console.log(this.state.mail.code)
            return;
        }

        this.setState({
            requestPending: true
        });
      
        $.ajax({
            type: 'post',
            url: '/api/sendmail',
            data: this.state.mail
        }).done(() => {
            this.props.sent();
        }).fail((err) => {
            this.setState({
                errText: err.responseText,
                requestPending: false
            });
        });
    }

    updateState(field, val) {
        let mail = this.state.mail;
        mail[field] = val;
        
        this.setState({
            mail: mail
        });
    }

    verify(e) {
        if (!!e) {
            let mail = this.state.mail;
            mail.code = e;
            this.setState({
                mail: mail,
            })
        } else {
            alert(`reCAPTCHA failed: ${e}`)
        }
    }

    verifyExpired() {
        let mail = this.state.mail;
        mail.code = null;
        this.setState({
            mail: mail
        });
    }

    render() {
        if (!this.state.key)
            return <i className="fad fa-spinner-third"></i>


        let errorText;
        if (!!this.state.errText)
            errorText = <small className="text-danger d-block pb-2">{this.state.errText}</small>

        return (
            <Fragment>
                <h3>Drop us an Email</h3>
                <p>
                    <span className="text-danger font-weight-bold">* </span> 
                    Denotes a required field.
                </p>

                <form className="row" onSubmit={this.sendMail.bind(this)}> {/* this.sendMail.bind(this) */}
                    <div className="col-lg-6 col-md-6 col-sm-12">
                        <FormGroup htmlFor="name" label="Your Name:" required>
                            <Input id="name" type="text" value={this.state.mail.name} autoComplete="name" cb={this.updateState.bind(this, 'name')} required />
                        </FormGroup>
                    </div>

                    <div className="col-lg-6 col-md-6 col-sm-12">
                        <FormGroup htmlFor="org" label="Organization:">
                            <Input id="org" type="text" value={this.state.mail.org} autoComplete="organization" cb={this.updateState.bind(this, 'org')} />
                        </FormGroup>
                    </div>

                    <div className="col-lg-6 col-md-6 col-sm-12">
                        <FormGroup htmlFor="email" label="Email:" required>
                            <Input id="email" type="email" value={this.state.mail.email} autoComplete="email" cb={this.updateState.bind(this, 'email')} required />
                        </FormGroup>
                    </div>

                    <div className="col-lg-6 col-md-6 col-sm-12">
                        <FormGroup htmlFor="phone" label="Phone Number:">
                            <Input id="phone" type="text" value={this.state.mail.phone} autoComplete="phone" cb={this.updateState.bind(this, 'phone')} />
                        </FormGroup>
                    </div>

                    <div className="col-12">
                        <FormGroup htmlFor="subject" label="Subject:" required>
                            <Input id="subject" type="text" value={this.state.mail.subject} cb={this.updateState.bind(this, 'subject')} required />
                        </FormGroup>
                    </div>

                    <div className="col-12">
                        <FormGroup htmlFor="message" label="Message:" required>
                            <TextArea id="message" maxLength="800" value={this.state.mail.message} rows={5} cb={this.updateState.bind(this, 'message')} required />

                            <Recaptcha
                                sitekey={this.props.config}
                                render="explicit"
                                verifyCallback={this.verify.bind(this)}
                                onloadCallback={() => console.log('reCAPTCHA loaded')}
                                expiredCallback={this.verifyExpired.bind(this)}
                            />
                        </FormGroup>
                    </div>

                    <div className="col-12">
                        {errorText}

                        <Button type="submit" pending={this.state.requestPending} disabled={!this.state.mail.code}>
                            Send Email &nbsp; <i className="fas fa-envelope"></i>
                        </Button>
                    </div>
                </form>
            </Fragment>
        )
    }
}