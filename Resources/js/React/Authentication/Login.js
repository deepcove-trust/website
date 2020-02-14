import React, { Component } from 'react';
import { render } from 'react-dom';
import { Button } from '../Components/Button';
import { FormGroup, Input } from '../Components/FormControl';
import Alert from '../Components/Alert';
import $ from 'jquery';

const baseUri = "/login";

export default class Login extends Component {
    constructor(props) {
        super(props);

        this.state = {
            loginPending: false,
            returnUrl: ""
        }
    }

    attemptLogin(e) {
        e.preventDefault();        
        this.setState({
            loginPending: true
        });

        let queryString = !!this.state.returnUrl ? `?ReturnUrl=${this.state.returnUrl}` : '';

        $.ajax({
            type: 'post',
            url: `${baseUri}${queryString}`,
            data: $("form").serialize()
        }).done((url) => {
            window.location.replace(url);
        }).fail((err) => {
            this.setState({
                loginPending: false
            }, () => this.Alert.error("Incorrect username or password", err.responseText));
        })
    }

    componentDidMount() {
        var urlParams = new URLSearchParams(window.location.search);
        if (urlParams.has('ReturnUrl')) {
            this.setState({
                returnUrl: urlParams.get('ReturnUrl')
            });
        }
    }

    render() {
        return (
            <Alert onRef={ref => (this.Alert = ref)}>
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

                        <FormGroup>
                            <Button className={`btn btn-primary btn-block`} type="submit" pending={this.state.loginPending}>Log In</Button>
                        </FormGroup>

                        <a className="forgot" href="/reset-password">Forgot your password?</a>
                    </form>
                </div>
            </Alert>
        );
    }
}


if (document.getElementById('react_login'))
    render(<Login />, document.getElementById('react_login'));