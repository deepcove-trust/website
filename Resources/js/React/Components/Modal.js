import React, { Component } from 'react';

export class Modal extends Component {

    getModalSize() {

        switch (this.props.size) {
            case "large":
                return "modal-lg";
            case "small":
                return "modal-sm"
            default:
                return ""

        }

    }

    render() {
        return (
            <div id={this.props.id || false} className="modal" tabindex="-1" role="dialog">
                <div className={`modal-dialog ${this.getModalSize()}`} role="document">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title">{this.props.title}</h5>
                            <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>
                        <div className="modal-body">
                            {this.props.children}
                        </div>
                    </div>
                </div>
            </div>
        );
    }

}