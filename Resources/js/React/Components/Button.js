import React, { Component, Fragment } from 'react';
import ReactDOM from 'react-dom';
import { setTimeout } from 'timers';
import { FormGroup, Input } from './FormControl';
import Modal from './Modal';

export class Button extends Component {
    constructor(props) {
        super(props);

        this.state = {
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

    handleClick() {
        if (this.props.cb)
            this.props.cb();
    }


    render() {
        let content;
        if (this.props.pending) {
            content = <i className="far fa-spinner-third fa-spin"></i>
        } else {
            content = this.props.children || "";
        }

        return (
            <button className={this.props.className || "btn btn-primary"}
                type={this.props.type || "button"}
                disabled={this.props.disabled || this.props.pending}
                style={{ minWidth: `${this.state.width}px` }}
                data-dismiss={this.props.dismiss || null}
                ref={this.contentRef}
                onClick={this.handleClick.bind(this)}
            >
                {content}
            </button>
        );
    }
}

export class BtnGroup extends Component {

    size() {
        switch (this.props.size) {
            case "sm":
                return "btn-group-sm";
            case "lg":
                return "btn-group-lg";
        }
    }

    direction() {
        return `btn-group${this.props.direction == 'vertical' ? '-vertical' : ''}`;
    }

    render() {
        return (
            <div role="group" className={`${this.direction()} ${this.size()} ${this.props.className || this.props.className || ''}`}>
                {this.props.children}
            </div>
        )
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
        let baseClasses = this.props.className || this.props.className || "btn btn-primary";

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
            <button className={this.getClass()}
                type="button"
                disabled={this.props.disabled || this.props.pending}
                style={{ minWidth: `${this.state.width}px` }}
                data-dismiss={this.props.dismiss || null}
                ref={this.contentRef}
                onClick={this.handleClick.bind(this)}
            >
                <span>{content}</span>
            </button>
        );
    }    
}

export class ConfirmModal extends Component {
    constructor(props) {
        super(props);

        this.state = {
            disabled: (this.props.confirmPhrase) ? true : false,
            input: "",
            showModal: false
        }

    }

    confirmed() {
        if (this.state.disabled) {
            return;
        }

        // Hide themodal
        this.setState({
            showModal: false
        }, () => {
            // Callback the action
            if (this.props.cb) this.props.cb();
        })
    }

    updateConfirmPhrase(e) {
        this.setState({
            disabled: e.toLowerCase() != this.props.confirmPhrase.toLowerCase(),
            input: e
        });
    }

    render() {
        let confirmPhrase = this.props.confirmPhrase ? (
            <FormGroup>
                <label>Please type "{this.props.confirmPhrase}" to confirm.</label>
                <Input type="string" cb={this.updateConfirmPhrase.bind(this)} value={this.state.input} />
            </FormGroup>
        ) : null
        
        let modal = this.state.showModal ? (
            <Modal className={this.props.modalClass} handleHideModal={() => { this.setState({showModal: false})}}>
                <h4 className="text-left">
                    <i className="far fa-exclamation-triangle pr-3"></i>
                    Really {this.props.question.toLowerCase()}?
                    </h4>
                <hr className="pb-2" />
                <p className="text-left">{this.props.explanation}</p>

                {confirmPhrase}

                <FormGroup>
                    <ConfirmButton className="btn btn-danger float-right  btn-sm"
                        disabled={this.state.disabled}
                        cb={this.confirmed.bind(this)}
                    >
                        {this.props.actionText || this.props.question}
                    </ConfirmButton>

                    <Button className="btn btn-dark float-right btn-sm mx-1" dismiss="modal">No</Button>
                </FormGroup>
            </Modal>
        ) : null

        return (
            <Fragment>
                <Button className={this.props.className || 'btn btn-danger'} cb={() => {
                    this.setState({
                        showModal: true
                    });
                }}>
                    {this.props.children}
                </Button>

                {modal}
            </Fragment>
        )
    }
}

export class Link extends Component {
    render() {
        return (
            <a className={`btn ${this.props.className || this.props.className || ""}`}
                href={this.props.href}
                target={this.props.target || null}
            >
                {this.props.children}
            </a>
        )
    }
}
