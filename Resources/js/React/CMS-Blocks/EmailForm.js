import React, { Component, Fragment } from 'react';
import { FormGroup, Input, TextArea, Checkbox } from '../Components/FormControl';
import { Button } from '../Components/Button';
import Recaptcha from 'react-recaptcha';

import { Name, Org } from './EmailForm/IdentityInputs';
import { Email, Phone } from './EmailForm/ContactInputs';
import { MessageBody, SendToBookings, Subject } from './EmailForm/EmailParts';
import MailSent from './EmailForm/Thanks';

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
                code: null,
                sendToBookings: false
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

        switch (field) {
            case "name":
                mail.name = val;
                break;
            case "email":
                mail.email = val;
                break;
            case "phone":
                mail.phone = val;
                break;
            case "org":
                mail.org = val;
                break;
            case "subject":
                mail.subject = val;
                break;
            case "message":
                mail.message = val;
                break;
            case "sendToBookings":
                mail.sendToBookings = val
                break;
        }

        this.setState({
            mail: mail
        });
    }

    hitMe(f, v) {
        console.log(`f ${f} : v ${v}`)
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
                
                <form className="row" onSubmit={this.sendMail.bind(this)}>
                    <Name value={this.state.mail.name} cb={this.updateState.bind(this, 'name')} />
                    <Org value={this.state.mail.org} cb={this.updateState.bind(this, 'org')} />

                    <Email value={this.state.mail.email} cb={this.updateState.bind(this, 'email')} />
                    <Phone value={this.state.mail.phone} cb={this.updateState.bind(this, 'phone')} />

                    <Subject value={this.state.mail.subject} cb={this.updateState.bind(this, 'subject')} />
                    <SendToBookings value={this.state.mail.sendToBookings} cb={this.updateState.bind(this, 'sendToBookings')} />
                    <MessageBody value={this.state.mail.message} cb={this.updateState.bind(this, 'message')} >
                        <Recaptcha
                            sitekey={this.props.config}
                            render="explicit"
                            verifyCallback={this.verify.bind(this)}
                            onloadCallback={() => console.log('reCAPTCHA loaded')}
                            expiredCallback={this.verifyExpired.bind(this)}
                        />
                    </MessageBody>
                        
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