import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { setTimeout } from 'timers';

export class Button extends Component {
    handleClick() {
        if (this.props.cb)
            this.props.cb();
    }

    getClass() {
        return this.props.btnClass || "btn btn-primary"
    }

    getType() {
        return this.props.type || "button";
    }

    render() {
        let content;
        if (this.props.pending) {
            content = <i className="far fa-spinner-third fa-spin"></i>
        } else {
            content = this.props.children || "";
        }

        return (
            <button className={this.getClass()} type={this.getType()} disabled={this.props.disabled || this.props.pending} onClick={this.handleClick.bind(this)}>
                {content}
            </button>
        );
    }
}

export class ConfirmButton extends Component {
    constructor(props) {
        super(props);

        this.state = {
            confirmPending: false,
            halt: false,
            width: 0
        };

        this.contentRef = React.createRef();
    }

    componentDidMount() {
        let width = ReactDOM.findDOMNode(this.contentRef.current).getBoundingClientRect().width;

        if (width > this.state.width) {
            let x = Math.round(width);
            x = Math.trunc(x);
            this.setState({ width: x });
        }
    }

    handleClick(e) {
        // Stops the user from double clicking
        if (this.state.halt)
            return;

        // If confirm pending callback
        if (this.state.confirmPending) {
            this.setState({ confirmPending: false }, () => {
                this.props.cb();
                return;
            });
        } else {

            this.setState({ confirmPending: true, halt: true }, () => {
                // Clear Flags
                setTimeout(() => {
                    this.setState({ halt: false });
                }, 0.5 * 1000);

                setTimeout(() => {
                    this.setState({ confirmPending: false })
                }, 5 * 1000);
            });
        }
    }

    getClass() {
        let confirm = this.state.confirmPending ? "btn-confirm" : "" ;
        let baseClasses = this.props.btnClass || "btn btn-primary";

        return `${baseClasses} ${confirm}`;
    }


    render() {
        let content;
        if (this.props.pending) {
            content = <i className="far fa-spinner-third fa-spin"></i>
        } else {
            content = this.props.children || "";
        }

        return (
            <button className={this.getClass()} type="button" disabled={this.props.disabled || this.props.pending} style={{ minWidth: `${this.state.width}px` }} ref={this.contentRef} onClick={this.handleClick.bind(this)}>
                <span>{content}</span>
            </button>
        );
    }    
}
