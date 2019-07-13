import React, { Component } from 'react';
import { render } from 'react-dom';
import { Button } from '../Components/Button';
import $ from 'jquery';

const baseUri = "/reset-password";

export default class RequestPasswordReset extends Component {
    constructor(props) {
        super(props);

        this.state = {
            requestFailed: false,
            requestPending: false,
            emailSent: false
        }
    }

    attemptRequest(e) {
        e.preventDefault();
        this.setState({ requestPending: true });

        if (this.state.emailSent)
            return;

        $.ajax({
            type: 'post',
            url: `${baseUri}`,
            data: $("form").serialize()
        }).done(() => {
            this.setState({ requestPending: false, emailSent: true, requestFailed: false });
        }).fail((err) => {
            this.setState({ requestPending: false, requestFailed: err.responseText });
        });
    }

    render() {
        let requestFailed;
        if (this.state.requestFailed) {
            requestFailed = (
                <div className="form-group">
                    <p className="text-danger">Something went wrong. Please try again.</p>
                </div>
            )
        }

        let emailSent;
        if (this.state.emailSent) {
            emailSent = (
                <div className="form-group">
                    <p className="text-success">We've sent you an email with instructions. It may take up to five minutes to appear.</p>
                </div>
            )
        }

        let btn_submit;
        if (!this.state.emailSent) {
            btn_submit = (
                <div className="form-group">
                    <Button btnClass={`btn btn-primary btn-block`} type="submit" pending={this.state.requestPending}> Reset My Password</Button>
                </div>
            )
        }

        return (
            <div className="login-clean text-center">
                <form onSubmit={this.attemptRequest.bind(this)}>
                    <h1 className="sr-only">Request password reset form</h1>
                    <h1 className="display-4 mb-5">Password Reset</h1>

                    <div className="form-group">
                        <input type="email" className="form-control" name="email" placeholder="Email" autoComplete="email" required />
                    </div>

                    {requestFailed}
                    {emailSent}
                    {btn_submit}

                    <a className="forgot" href="/login">Know your details? Login Here</a>
                </form>
            </div>
        );
    }
}


if (document.getElementById('react_requestPasswordreset'))
    render(<RequestPasswordReset />, document.getElementById('react_requestPasswordreset'));