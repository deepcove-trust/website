import React, { Component } from 'react';

export default class PhonePreview extends Component {
    /**
     * <PhonePreview> class will make a phone by default optional colours white for phone, silver for tablet
     * To select the tablet, or an optional colour use the key word as a prop, example: <PhonePreview tablet silver>
     * Both devices are portrait unless you specify 'landscape'
     * */
    render() {
        return !this.props.tablet ? (
            <div className={`marvel-device ipad ${this.props.silver ? 'silver' : 'black'} ${this.props.landscape ? 'landscape' : ''}`}>
                <div className="camera"/>
                <div className="screen">
                    {this.props.children}
                </div>
            </div>
        ) : (
            <div className={`marvel-device s5 ${this.props.white ? 'white' : 'black'} ${this.props.landscape ? 'landscape' : ''}`}>
                <div className="top-bar"/>
                <div className="sleep"/>
                <div className="camera"/>
                <div className="sensor"/>
                <div className="speaker"/>
                <div className="screen">
                    {this.props.children}
                </div>
                <div className="home"/>
            </div>
        );           
    }
}