import React, { Component } from 'react';

export default class Card extends Component {
    render() {
        return (
            <div id={this.props.id || null} className={`card ${this.props.className}`} style={this.props.style || null}>
                {this.props.children}
            </div>
        );
    }
}

export class CardHead extends Component {
    render() {
        return (
            <div id={this.props.id || null} className={`card-header ${this.props.className}`} style={this.props.style || null}>
                {this.props.children}
            </div>
        );
    }
}

export class CardHighlight extends Component {
    render() {
        return (
            <div id={this.props.id || null} className={`card-highlight bground-primary ${this.props.className}`} style={this.props.style || null}>
                {this.props.children}
            </div>
        );
    }
}

export class CardBody extends Component {
    render() {
        return (
            <div id={this.props.id || null} className={`card-body ${this.props.className}`} style={this.props.style || null}>
                {this.props.children}
            </div>
        )
    }
}