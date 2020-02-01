import React, { Component, Fragment } from 'react';

export default class Card extends Component {
    render() {
        return (
            <div id={this.props.id || null} className={this.props.className || "card"} style={this.props.style || null}>
                {this.props.children}
            </div>
        );
    }
}

export class CardHead extends Component {
    render() {
        return (
            <div id={this.props.id || null} className={this.props.className || "card-header"} style={this.props.style || null}>
                {this.props.children}
            </div>
        );
    }
}

export class CardHighlight extends Component {
    render() {
        return (
            <div id={this.props.id || null} className={'card-highlight bground-primary'} style={this.props.style || null}>
                {this.props.children}
            </div>
        );
    }
}

export class CardBody extends Component {
    render() {
        return (
            <div id={this.props.id || null} className={this.props.className || 'card-body'} style={this.props.style || null}>
                {this.props.children}
            </div>
        )
    }
}