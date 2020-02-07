import React, { Component } from "react";
import InternalServerError from "./InternalServerError";

export default class ErrorBoundary extends Component {

    constructor(props) {
        super(props);
        this.state = {
            hasError: false
        };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true }
    }

    render() {
        if (this.state.hasError) {
            return <InternalServerError customError={this.props.customError} />
        }

        return this.props.children;
    }
}