import React, { Component } from 'react';
import { render } from 'react-dom';

export default class PasswordExpired extends Component {

    render() {
        return (
            <div className="login-clean text-center">
                <form>
                    <i className="far fa-envelope-open fa-5x text-center"/>
                    <h1 className="display-5 mb-4">Password Expired</h1>
                    <p mb="2">We need you to change your password, please check your emails.</p>
                </form>
            </div>
        );
    }
}


if (document.getElementById('react_errorPasswordExpired'))
    render(<PasswordExpired />, document.getElementById('react_errorPasswordExpired'));