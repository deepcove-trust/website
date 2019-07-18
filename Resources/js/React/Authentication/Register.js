import React, { Component } from 'react';
import { render } from 'react-dom';
import { Button } from '../Components/Button';
import { FormGroup, Input } from '../Components/FormControl';
import $ from 'jquery';

const baseUri = "/register";

export default class Register extends Component {
    constructor(props) {
        super(props);

        this.state = {
            requestFailed: false,
            requestPending: false
        }
    }

    attemptRegistration(e) {
        e.preventDefault();

        this.setState({
            requestPending: true
        });

        $.ajax({
            type: 'post',
            url: `${baseUri}`,
            data: $("#register").serialize()
        }).done(() => {
            window.location.replace("/admin-portal/users");
        }).fail((err) => {
            this.setState({
                requestFailed: err.responseText,
                requestPending: false
            });

            console.error(`[Register@attemptLogin] Error registering new account: `, err.responseText);
        })
    }

    render() {
        let helperLabel = (
            <p className="text-dark">
                The user will be emailed their login information.
            </p>
        );

        if (this.state.requestFailed) {
            helperLabel = (
                <FormGroup>
                    <p className="text-danger">{this.state.requestFailed}</p>
                </FormGroup>
            )
        }

        return (
            <div className="login-clean text-center">
                <form id="register" onSubmit={this.attemptRegistration.bind(this)}>
                    <h1 className="sr-only">Login Form</h1>
                    <h1 className="display-4 mb-5">Create a New User</h1>

                    <FormGroup>
                        <Input type="text" name="name" placeHolder="Name" autoComplete="name" autoFocus required />
                    </FormGroup>

                    <FormGroup>
                        <Input type="email" name="email" placeHolder="Email" autoComplete="email" required />
                    </FormGroup>

                    {helperLabel}

                    <FormGroup>
                        <Button btnClass={`btn btn-primary btn-block`} type="submit" pending={this.state.requestPending}>Create Account</Button>
                    </FormGroup>
                </form>
            </div>
        );
    }
}


if (document.getElementById('react_register'))
    render(<Register />, document.getElementById('react_register'));