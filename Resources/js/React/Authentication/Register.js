import React, { Component } from 'react';
import { render } from 'react-dom';
import { Button } from '../Components/Button';
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

    attemptLogin(e) {
        e.preventDefault();

        this.setState({ requestPending: true });
        $.ajax({
            type: 'post',
            url: `${baseUri}`,
            data: $("#register").serialize()
        }).done(() => {
            window.location.replace("/admin-portal/users");
        }).fail((err) => {
            this.setState({ requestFailed: err.responseText, requestPending: false });
        })
    }

    render() {
        let requestFailed;
        if (this.state.requestFailed) {
            requestFailed = (
                <div className="form-group">
                    <p className="text-danger">{this.state.requestFailed}</p>
                </div>
            )
        } else {
            requestFailed = (
                <p className="text-dark">
                    <i className="fas fa-info-circle"></i>
                    The user will be emailed their login information.
                </p>
            )
        }

        return (
            <div className="login-clean text-center">
                <form id="register" onSubmit={this.attemptLogin.bind(this)}>
                    <h1 className="sr-only">Login Form</h1>
                    <h1 className="display-4 mb-5">Create a New User</h1>

                    <div className="form-group">
                        <input type="text" className="form-control" name="name" placeholder="Name" autoComplete="name" required />
                    </div>

                    <div className="form-group">
                        <input type="email" className="form-control" name="email" placeholder="Email" autoComplete="email" required />
                    </div>

                    {requestFailed}

                    <div className="form-group">
                        <Button btnClass={`btn btn-primary btn-block`} type="submit" pending={this.state.requestPending}>Create Account</Button>
                    </div>
                </form>
            </div>
        );
    }
}


if (document.getElementById('react_register'))
    render(<Register />, document.getElementById('react_register'));