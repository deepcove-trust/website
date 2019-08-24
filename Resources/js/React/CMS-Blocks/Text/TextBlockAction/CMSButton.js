import React, { Component } from 'react'
import { isExternalUrl } from '../../../../helpers.js'

export default class CMSButton extends Component {

    align() {
        switch (this.props.link.align) {
            case "center":
                return "text-center";

            case "right":
                return "text-right";

            default:
                return false;
        }
    }

    render() {
        let urlIcon;
        if (isExternalUrl(this.props.link.href)) {
            urlIcon = <i className="far fa-external-link-alt"></i>
        }

        return (
            <div className={this.align()}>
                <a className={`btn btn-${this.props.link.color} ${this.props.link.align == "block" ? "btn-block" : ""}`}
                    href={this.props.link.href}>
                    {this.props.link.text} &nbsp; {urlIcon}
                </a>
            </div>
        );
    }
}