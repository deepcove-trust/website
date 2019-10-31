import React, { Component } from 'react';

export default class Panel extends Component {
    

    render() {
        let cardHead;
        if (this.props.cardHead) {
            cardHead = (
                <div className="card-header">
                    <h5 className="mb-0">{this.props.cardHead}</h5>
                </div>
            )
        }

        let cardFoot;
        if (this.props.cardFoot) {
            cardFoot = (
                <div className="card-footer">
                    {this.props.cardFoot}
                </div>
            )
        }
        
        return (
            <div className={`card ${this.props.className || ''}`}>
                {cardHead}

                <div className="card-body" style={this.props.style || null}>
                    {this.props.children}
                </div>

                {cardFoot}
            </div>
        );
    }
}