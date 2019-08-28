import React, { Component, Fragment } from 'react';
import ReactDOM from 'react-dom';
import { setTimeout } from 'timers';
import { FormGroup, Input } from './FormControl';
import { Modal } from './Modal';
import $ from 'jquery';


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
            <button className={this.props.btnClass || "btn btn-primary"}
                type={this.props.type || "button"}
                disabled={this.props.disabled || this.props.pending}
                style={{ minWidth: `${this.state.width}px` }}
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
            <div role="group" class={`${this.direction()} ${this.size()} ${this.props.btnClass || ''}`}>
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
            <button className={this.getClass()}
                type="button"
                disabled={this.props.disabled || this.props.pending}
                style={{ minWidth: `${this.state.width}px` }}
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
            disabled: (this.props.confirmPhrase) ? true : false
        }

    }

    confirmed() {
        if (this.state.disabled) {
            return;
        }
        // Hide themodal
        this.toggleModal('hide');
        // Callback the action
        if (this.props.cb)
            this.props.cb();
    }

    toggleModal(e){
        $(`#confirmodal`).modal(e ? e : 'toggle');
    }

    updateConfirmPhrase(e) {
        this.setState({
            disabled: e.toLowerCase() != this.props.confirmPhrase.toLowerCase()
        });
    }

    render() {

        let confirmPhrase;
        if (this.props.confirmPhrase) {
            confirmPhrase = (
                <FormGroup>
                    <label>Please type "{this.props.confirmPhrase}" to confirm.</label>
                    <Input type="string" cb={this.updateConfirmPhrase.bind(this)}/>
                </FormGroup>
            )
        }

        return (
            <Fragment>
                <Button btnClass={this.props.btnClass || 'btn btn-danger'} cb={this.toggleModal.bind(this)}>
                    {this.props.children}
                </Button>
                
                <Modal id={`confirmodal`}>
                    <h4>
                        <i className="far fa-exclamation-triangle pr-3"></i>
                        Really {this.props.question.toLowerCase()}?
                    </h4>
                    <hr className="pb-2"/>
                    <p>{this.props.explanation}</p>

                    {confirmPhrase}

                    <FormGroup>
                        <ConfirmButton btnClass="btn btn-danger float-right"
                            disabled={this.state.disabled}
                            cb={this.confirmed.bind(this)}
                        >
                            {this.props.actionText || this.props.question}
                        </ConfirmButton>

                        <Button btnClass="btn btn-dark float-right mx-1"
                            cb={this.toggleModal.bind(this, 'hide')}
                        >
                            No
                        </Button>
                    </FormGroup>
                </Modal>
            </Fragment>
        )
    }
}