import React, { Component, Fragment } from 'react';
import CMSButton from './TextBlockAction/CMSButton';
import CMSLink from './TextBlockAction/CMSLink';

export default class TextBlockAction extends Component {

    render() {
        // No props provided, don't render
        if (!this.props.link)
            return;

        let ui;
        if (this.props.link.isButton) {
            ui = <CMSButton link={this.props.link} />            
        } else {
            ui = <CMSLink link={this.props.link} />
        }

        return (
            <Fragment>
                {ui}
            </Fragment>
        )
    }
}