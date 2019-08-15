import React, { Component, Fragment } from 'react';

export default class TextBlockLink extends Component {
    isExternalUrl(href) {
        if (!href) {
            return;
        }

        // If the hyperlink is external, add an icon to the end of the text
        return href.includes("http://") || href.includes("https://") && !href.includes(window.location.hostname);
    }

    alignBtn() {
        switch (this.props.link.align) {
            case "center":
                return "text-center";

            case "right":
                return "text-right";

            default:
                return false;
        }
    }

    alignText() {
        let align = this.props.link.align;

        if (align == "default" || align == "block" || align == null) {
            return "";
        } else {
            return `d-block text-${align}`;
        }
    }

    render() {
        // No props provided, don't render
        if (!this.props.link)
            return;

        let urlIcon;
        if (this.isExternalUrl(this.props.link.href)) {
            urlIcon = <i className="far fa-external-link-alt"></i>
        }

        let ui;
        if (this.props.link.isButton) {
            {urlIcon}
            ui = (
                <div className={this.alignBtn()}>
                    <a className={`btn btn-${this.props.link.color} ${this.props.link.align == "block" ? "btn-block" : ""}`}
                        href={this.props.link.href}>
                        {this.props.link.text} {urlIcon}
                    </a>
                </div>
            )
        } else {
            ui = <a className={`text-${this.props.link.color} ${this.alignText()}`}
                    href={this.props.link.href}>
                    {this.props.link.text} {urlIcon}
                </a>
        }

        return (
            <Fragment>
                {ui}
            </Fragment>
        )
    }
}