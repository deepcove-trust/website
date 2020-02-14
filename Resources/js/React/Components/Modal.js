import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import $ from 'jquery';

export default class Modal extends Component {   
    componentDidMount() {
        $(ReactDOM.findDOMNode(this)).modal('show');
        $(ReactDOM.findDOMNode(this)).on('hidden.bs.modal', () => this.props.handleHideModal());
    }

    componentWillUnmount() {
        $(ReactDOM.findDOMNode(this)).modal('hide');
    }

    size() {
        switch (this.props.size) {
            case "large":
            case "lg":
                return "modal-lg";
            case "small":
            case "sm":
                return "modal-sm";
            default: return "";
        }
    }

    render() {
        let headder = this.props.title ? (
            <div className="modal-header">
                <h5 className="modal-title">{this.props.title}</h5>
                <button type="button" className="close" data-dismiss="modal" aria-label="close">
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>
        ) : null

        let footer = this.props.footer ? (
            <div className="modal-footer">
                {this.props.footer}
            </div>
        ) : null
        
        return (
            <div className={`modal fade ${this.props.className || ''}`} role="dialog">
                <div className={`modal-dialog ${this.size()}`} role="document">
                    <div className="modal-content">
                        {headder}
                        
                        <div className="modal-body" style={this.props.style || null}>
                            {this.props.children}
                        </div>

                        {footer}
                    </div>
                </div>
            </div>
        );
    }
}