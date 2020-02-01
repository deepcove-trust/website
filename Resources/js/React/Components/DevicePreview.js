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

    handleBack() {
        if (this.props.onBack)
            this.props.onBack();
    }

    render() {
        const { children, backBar} = this.props;
        let backBar_ui = !!backBar ? <div className="back-button-bar" onClick={this.handleBack.bind(this)}>Back</div> : null;
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
        const { backBar, children, landscape, onBack, silver, tablet, white } = this.props;
        let device = tablet
            ? <Tablet silver={silver} landscape={landscape}>
                <ScrollWrapper backBar={backBar} onBack={onBack}>
                    {children}
                </ScrollWrapper>
            </Tablet>
            : <Phone white={white} landscape={landscape}>
                <ScrollWrapper backBar={backBar} onBack={onBack}>
                    {children}
                </ScrollWrapper>
            </Phone>

        return (
            <PreviewWrapper sticky={this.props.sticky}>
                {device}
            </PreviewWrapper>
        )
    }
}