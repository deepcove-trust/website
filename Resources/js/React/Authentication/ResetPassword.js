import React, { Component } from 'react';
import { render } from 'react-dom';
import { Button } from '../Components/Button';
import { FormGroup, Input } from '../Components/FormControl';
import $ from 'jquery';


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

        this.setState({
            requestPending: true
        });

        $.ajax({
            type: 'post',
            url: `${window.location.href}`,
            data: $("form").serialize()
        }).done(() => {
            location.replace("/login");
        }).fail((err) => {
            this.setState({
                requestPending: false,
                requestFailed: err.responseText
            });

            console.error(`[ResetPassword@attemptRequest] Error changing password: `, err.responseText);
        })
    }

    render() {
        let requestFailed;
        if (this.state.requestFailed) {
            requestFailed = (
                <FormGroup>
                    <p className="text-danger">{this.state.requestFailed}</p>
                </FormGroup>
            )
        }

        return (
            <div className="login-clean text-center">
                <form onSubmit={this.attemptRequest.bind(this)}>
                    <h1 className="sr-only">New email password form</h1>
                    <h1 className="display-4 mb-5">New Password</h1>

                    <FormGroup>
                        <Input type="email" name="email" placeHolder="Email" autoComplete="email" autoFocus required />
                    </FormGroup>

                    <FormGroup>
                        <Input type="password" name="password" placeHolder="New Password" autoComplete="new-password" minLength="6" required />
                    </FormGroup>

                    <FormGroup>
                        <Input type="password" name="passswordConfirm" placeHolder="Retype Password" autoComplete="new-password" minLength="6" required />
                    </FormGroup>

                    {requestFailed}

                    <FormGroup>
                        <Button btnClass={`btn btn-primary btn-block`} type="submit" pending={this.state.requestPending}> Reset My Password</Button>
                    </FormGroup>
                </form>
            </div>
        );
    }
}


if (document.getElementById('react_resetPassword'))
    render(<ResetPassword />, document.getElementById('react_resetPassword'));