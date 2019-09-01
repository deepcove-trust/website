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
            formData: {
                email: "",
                password: "",
                passwordConfirm: ""
            }
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

    componentDidMount() {
        var urlParams = new URLSearchParams(window.location.search);
        if (urlParams.has('email')) {
            this.updateState('email',
                decodeURIComponent(urlParams.get('email'))
            )
        }
    }

    updateState(field, val) {
        let formData = this.state.formData;
        formData[field] = val || "";
        this.setState({
            formData: formData
        });
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
                        <Input type="email"
                            name="email"
                            placeHolder="Email"
                            autoComplete="email"
                            value={this.state.formData.email}
                            cb={this.updateState.bind(this, 'email')}
                            autoFocus
                            required
                        />
                    </FormGroup>

                    <FormGroup>
                        <Input type="password"
                            name="password"
                            placeHolder="New Password"
                            autoComplete="new-password"
                            minLength="6"
                            value={this.state.formData.password}
                            cb={this.updateState.bind(this, 'password')}
                            required
                        />
                    </FormGroup>

                    <FormGroup>
                        <Input type="password"
                            name="passswordConfirm"
                            placeHolder="Retype Password"
                            autoComplete="new-password"
                            minLength="6"
                            value={this.state.formData.passwordConfirm}
                            cb={this.updateState.bind(this, 'passwordConfirm')}
                            required
                        />
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