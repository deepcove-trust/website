import React, { Component } from 'react';
import { render } from 'react-dom';

export default class InactiveAccount extends Component {

    render() {


        return (
            <div className="login-clean text-center">
                <form>
                    <i className="fas fa-ban fa-5x text-center"></i>
                    <h1 className="display-5 mb-4">Account Inactive</h1>
                    <p mb="2">An administrator needs to activate your account.</p>
                    <p>We'll send you an email once this has been done.</p>
                </form>
            </div>
        );
    }
}


if (document.getElementById('react_errorInactiveAccount'))
    render(<InactiveAccount />, document.getElementById('react_errorInactiveAccount'));