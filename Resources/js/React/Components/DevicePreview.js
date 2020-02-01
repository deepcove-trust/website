import React, { Component } from 'react';

class PreviewWrapper extends Component {
    render() {
        const { children, sticky } = this.props;
        return <div className={!!sticky ? 'm-3 sticky-preview' : null}>
            {children}
        </div>
    }
}

class ScrollWrapper extends Component {
    render() {
        const { children, backBar} = this.props;
        let backBar_ui = !!backBar ? <div className="back-button-bar">Back</div> : null;
        return (
            <div className="h-100">
                <div className={`preview-body ${!!backBar ? 'with-back-button' : ''}`}>
                    <div>
                        {children}
                    </div>
                </div>
                {backBar_ui}
            </div>
        )
    }
}

class Phone extends Component {
    render() {
        const { children, landscape, white } = this.props;

        return (
            <div className={`marvel-device s5 ${white ? 'white' : 'black'} ${landscape ? 'landscape' : ''}`}>
                <div className="top-bar" />
                <div className="sleep" />
                <div className="camera" />
                <div className="sensor" />
                <div className="speaker" />
                <div className="screen">
                    {children}
                </div>
                <div className="home" />
            </div>
        );
    }
}

class Tablet extends Component {
    render() {
        const { children, landscape, silver } = this.props;

        return(
            <div className={`marvel-device ipad ${silver ? 'silver' : 'black'} ${landscape ? 'landscape' : ''}`}>
                <div className="camera" />
                <div className="screen">
                    {children}
                </div>
            </div>
        )
    }
}

export default class DevicePreview extends Component {
    /**
     * <PhonePreview> class will make a phone by default optional colours white for phone, silver for tablet
     * To select the tablet, or an optional colour use the key word as a prop, example: <PhonePreview tablet silver>
     * Both devices are portrait unless you specify 'landscape'
     * */
    render() {
        let device = this.props.tablet
            ? <Tablet silver={this.props.silver} landscape={this.props.landscape}>
                <ScrollWrapper backBar={this.props.backBar}>
                    {this.props.children}
                </ScrollWrapper>
            </Tablet>
            : <Phone white={this.props.white} landscape={this.props.landscape}>
                <ScrollWrapper backBar={this.props.backBar}>
                    {this.props.children}
                </ScrollWrapper>
            </Phone>

        return (
            <PreviewWrapper sticky={this.props.sticky}>
                {device}
            </PreviewWrapper>
        )
    }
}