import React, { Component } from 'react'
import { isExternalUrl } from '../../../../helpers.js'

export default class CMSLink extends Component {


    alignText() {
        let align = this.props.link.align;

        if (align == "default" || align == "block" || align == null) {
            return "";
        } else {
            return `d-block text-${align}`;
        }
    }

    render() {

        let urlIcon;
        if (isExternalUrl(this.props.link.href)) {
            urlIcon = <i className="far fa-external-link-alt"></i>
        }

        return (
            <a className={`text-${this.props.link.color} ${this.alignText()}`}
                href={this.props.link.href}>
                {this.props.link.text} &nbsp; {urlIcon}
            </a>
        );

    }
}