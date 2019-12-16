import React, { Component } from 'react';
import { render } from 'react-dom';

export default class InternalServerError extends Component {
    constructor(props) {
        super(props);

        this.state = {
            errorId: ""
        }
    }

    componentDidMount() {
        this.setState({
            errorId: document.getElementById('react_errorInternalServerError').getAttribute('data-requestid') || "No Error Code"
        });
    }

    render() {
        return (
            <div className="login-clean text-center">
                <form>
                    <img className="rounded-circle kea" src="/images/kea.png" alt="Kea" />
                    <h1 className="display-5 mb-4">Something went wrong</h1>
                    <span mb="0">Please try again later or, </span>
                    <p mb="2">contact us with the Error ID:</p>
                    <p>{this.state.errorId}</p>
                </form>
            </div>
        );
    }
}


if (document.getElementById('react_errorInternalServerError'))
    render(<InternalServerError />, document.getElementById('react_errorInternalServerError'));