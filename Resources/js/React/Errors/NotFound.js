import React, { Component } from 'react';
import { render } from 'react-dom';

export default class NotFoundError extends Component {
    render() {
        return (
            <div className="login-clean text-center">
                <form>
                    <h1 className="display-5 my-4">Sorry, we seem to have lost that page</h1>
                    <span mb="0">It may have been deleted,</span>
                    <p mb="2">Visit our <a href="/">Home Page</a> or <a href="/contact-us">Contact Us</a>`</p>
                </form>
            </div>
        );
    }
}


if (document.getElementById('react_errorNotFoundError'))
    render(<NotFoundError />, document.getElementById('react_errorNotFoundError'));