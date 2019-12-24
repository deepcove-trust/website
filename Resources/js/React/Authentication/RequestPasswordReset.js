import React, { Component, Fragment } from 'react';
import { render } from 'react-dom';
import { Button } from '../Components/Button';
import { FormGroup, Input } from '../Components/FormControl';
import Alert from '../Components/Alert';
import $ from 'jquery';

const baseUri = "/reset-password";

export default class RequestPasswordReset extends Component {
    constructor(props) {
        super(props);

        this.state = {
            requestPending: false,
            emailSent: false
        }
    }

    attemptRequest(e) {
        e.preventDefault();

        this.setState({
            requestPending: true
        });

        if (this.state.emailSent)
            return;

        $.ajax({
            type: 'post',
            url: `${baseUri}`,
            data: $("form").serialize()
        }).done(() => {
            this.setState({
                requestPending: false,
                emailSent: true,
            }, () => this.Alert.success('Account recovery email has been sent'));
        }).fail((err) => {
            this.setState({
                requestPending: false,
            }, () => this.Alert.error(null, err.responseText));
        });
    }

    render() {
        let button = !this.state.emailSent ? (
            <Fragment>
                <Button className={`btn btn-primary btn-block`} type="submit" pending={this.state.requestPending}>
                    Reset My Password
                </Button>

                <a className="forgot" href="/login">Know your details? Login Here</a>
            </Fragment>
        ) : (
            <div className="fade2sec">
                <span className="text-success">We've sent you a password reset email. Once you've reset your password click the button below</span>
                <a className={`btn btn-primary btn-block`} href="/login">Login</a>
            </div>
        );

        return (
            <Alert onRef={ref => (this.Alert = ref)}>
                <div className="login-clean text-center">
                    <form onSubmit={this.attemptRequest.bind(this)}>
                        <h1 className="sr-only">Request password reset form</h1>
                        <h1 className="display-4 mb-5">Password Reset</h1>

                        <FormGroup>
                            <Input type="email" name="email" placeHolder="Email" autoComplete="email" autoFocus required />
                        </FormGroup>

                        <FormGroup>
                            {button}
                        </FormGroup>
                    </form>
                </div>
            </Alert>
        );
    }
}


if (document.getElementById('react_requestPasswordreset'))
    render(<RequestPasswordReset />, document.getElementById('react_requestPasswordreset'));