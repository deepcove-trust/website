import React, { Component } from 'react';
import { render } from 'react-dom';
import Button from '../Components/Button';

const baseUri = "/reset-password";

export default class ResetPassword extends Component {
    constructor(props) {
        super(props);

        this.state = {
            requestFailed: false,
            requestPending: false,
        }
    }

    attemptRequest(e) {
        e.preventDefault();
        console.log("Tried to login");
    }

    render() {
        let requestFailed;
        if (this.state.requestFailed) {
            requestFailed = (
                <div className="form-group">
                    <p className="text-danger">{this.state.requestFailed}</p>
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

        return (
            <div className="login-clean text-center">
                <form onSubmit={this.attemptRequest.bind(this)}>
                    <h1 className="sr-only">New email password form</h1>
                    <h1 className="display-4 mb-5">New Password</h1>

                    <div class="form-group">
                        <input class="form-control" type="password" name="password" placeholder="New Password" autoComplete="new-password" minlength="6" required/>
                    </div>

                    <div class="form-group">
                        <input class="form-control" type="password" name="passswordConfirm" placeholder="Retype Password" minlength="6" required/>
                    </div>

                    {requestFailed}

                    <div className="form-group">
                        <Button btnClass={`btn btn-primary btn-block`} type="submit" pending={this.state.requestPending}> Reset My Password</Button>
                    </div>
                </form>
            </div>
        );
    }
}


if (document.getElementById('react_resetPassword'))
    render(<ResetPassword />, document.getElementById('react_resetPassword'));