import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import $ from 'jquery';

export default class Modal extends Component {   
    componentDidMount() {
        $(ReactDOM.findDOMNode(this)).modal('show');
        $(ReactDOM.findDOMNode(this)).on('hidden.bs.modal', () => this.props.handleHideModal());
    }

    size() {
        switch (this.props.size) {
            case "large":
            case "lg":
                {
                    return "modal-lg";
                    break;
                }
            case "small":
            case "sm":
                {
                    return "modal-sm";
                    break;
                }

            default:
                return "";
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
        
        return (
            <div className="modal fade" role="dialog">
                <div className={`modal-dialog ${this.size()}`} role="document">
                    <div className="modal-content">
                        {headder}
                        
                        <div className="modal-body">
                            {this.props.children}
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}