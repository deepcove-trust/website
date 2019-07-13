import React, { Component } from 'react';
import { render } from 'react-dom';
import { Button } from '../Components/Button';
import $ from 'jquery';

const baseUri = "/login";

export default class Login extends Component {
    constructor(props) {
        super(props);

        this.state = {
            loginFailed: false,
            loginPending: false
        }
    }

    attemptLogin(e) {
        e.preventDefault();

        this.setState({ loginPending: true });
        $.ajax({
            type: 'post',
            url: `${baseUri}`,
            data: $("form").serialize()
        }).done(() => {
            window.location.replace("/admin-portal");
        }).fail((err) => {
            this.setState({ loginFailed: err.responseText, loginPending: false });
        })
    }

    render() {
        let loginFailed;
        if (this.state.loginFailed) {
            loginFailed = (
                <div className="form-group">
                    <p className="text-danger">{this.state.loginFailed}</p>
                </div>
            )
        }

        return (
            <div className="login-clean text-center">
                <form onSubmit={this.attemptLogin.bind(this)}>
                    <h1 className="sr-only">Login Form</h1>
                    <h1 className="display-4 mb-5">Log In</h1>

                    <div className="form-group">
                        <input type="email" className="form-control" name="email" placeholder="Email" autoComplete="email" required/>
                    </div>

                    <div className="form-group">
                        <input type="password" className="form-control" name="password" placeholder="Password" required/>
                    </div>

                    {loginFailed}

                    <div className="form-group">
                        <Button btnClass={`btn btn-primary btn-block`} type="submit" pending={this.state.loginPending}>Log In</Button>
                    </div>

                    <a className="forgot" href="/reset-password">Forgot your email or password?</a>
                </form>
            </div>
        );
    }
}


if (document.getElementById('react_login'))
    render(<Login />, document.getElementById('react_login'));