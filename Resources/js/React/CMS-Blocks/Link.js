import React, { Component, Fragment } from 'react';
import { Button, ConfirmButton } from '../Components/Button';

/**
 *  link: {//Button or hyperlink
 *     id: 0,************
 *     Text: "This is a button/link example", ***************
 *     href: "/url-to-action",// Relative URL means instie, absolute means we show an external icon ***********
 *     isButton: true, // Button or link *******
 *     btnClass: null,// Btn Colours (Only used on buttons)
 *     align: null,//Left, Right, Center, Block (should be converted to classes  )
 *  }
 * */

export default class TextBlockLink extends Component {
    isExternalUrl(href) {
        // Contains http OR https AND does != current site HOST
         // return > TRUE
          // else False
        return href.includes("http://") || href.includes("https://") && !href.includes(window.location.hostname);
    }

    alignBtn() {
        switch (this.props.link.align) {
            case "block":
                return "btn-block";

            case "center":
                return "d-block mx-auto";

            case "right":
                return "d-block mr-0 ml-auto";

            default:
                return "";
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
            ui = <Button btnClass={`btn btn-${this.props.link.color} ${this.alignBtn()}`}>{this.props.link.text} {urlIcon}</Button>
        } else {
            ui = <a className={`text-${this.props.link.color} ${this.alignText()}`} href={this.props.link.href}>{this.props.link.text} {urlIcon}</a>
        }

        return (
            <Fragment>
                {ui}
            </Fragment>
        )
    }
}