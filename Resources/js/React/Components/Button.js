import React, { Component } from 'react';

export default class Button extends Component {
    getClass() {
        return this.props.btnClass ? this.props.btnClass : "btn btn-primary"
    }

    getType() {
        return this.props.type || "button";
    }

    render() {
        let content;
        if (this.props.pending) {
            content = < i className="far fa-spinner-third fa-spin" ></i>
        } else {
            content = this.props.children || "";
        }

        let disabled = this.props.disabled || this.props.pending ? true : false;

        return (
            <button className={this.getClass()} type={this.getType()} disabled={disabled}>
                {content}
            </button>
        );
    }
}