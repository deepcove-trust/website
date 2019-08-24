import React, { Component } from 'react';
import { render } from 'react-dom';
import { Button } from '../Components/Button';
import { FormGroup, Input } from '../Components/FormControl';
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

        this.setState({
            loginPending: true
        });

        $.ajax({
            type: 'post',
            url: `${baseUri}`,
            data: $("form").serialize()
        }).done((url) => {
            window.location.replace(url);
        }).fail((err) => {
            this.setState({
                loginFailed: err.responseText,
                loginPending: false
            });

            console.error(`[Login@attemptLogin] Error logging in: `, err.responseText);
        })
    }

    render() {
        let loginFailed;
        if (this.state.loginFailed) {
            loginFailed = (
                <FormGroup>
                    <p className="text-danger">{this.state.loginFailed}</p>
                </FormGroup>
            )
        }

        return (
            <div className="login-clean text-center">
                <form onSubmit={this.attemptLogin.bind(this)}>
                    <h1 className="sr-only">Login Form</h1>
                    <h1 className="display-4 mb-5">Log In</h1>

                    <FormGroup>
                        <Input type="email" name="email" placeHolder="Email" autoComplete="email" autoFocus required/>
                    </FormGroup>

                    <FormGroup>
                        <Input type="password" name="password" placeHolder="Password" autoComplete="Password" required />
                    </FormGroup>

                    {loginFailed}

                    <FormGroup>
                        <Button btnClass={`btn btn-primary btn-block`} type="submit" pending={this.state.loginPending}>Log In</Button>
                    </FormGroup>

                    <a className="forgot" href="/reset-password">Forgot your email or password?</a>
                </form>
            </div>
        );
    }
}


if (document.getElementById('react_login'))
    render(<Login />, document.getElementById('react_login'));