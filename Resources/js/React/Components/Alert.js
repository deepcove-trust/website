import React, { Component, Fragment } from 'react';
import Alert from 'react-s-alert';
import $ from 'jquery';

const defaultMsg = { ui: null, debug: null };

export default class AlertWrapper extends Component {
    /**
     * Creates the required ref
     * so we can call the alert() 
     * and responseAlert() methods
     */
    componentDidMount() {
        if (this.props.onRef) {
            this.props.onRef(this);
        }
    }

    /**
     * Tides up resources after use
     */
    componentWillUnmount() {
        if(this.props.onRef) {
            this.props.onRef(undefined);
        }
    }

    /**
     * 
     * @param {string} message
     * @param {[object, object]} responseText
     * @param {[function, function]} cb
     */
    error(message, responseText, cb) {
        let msg = $.parseJSON(responseText) || defaultMsg;

        Alert.error(msg.ui || message, {
            onShow: this._handleOnShow('error', msg.debug, cb)
        });
    }

    /**
    *
    * @param {string} message
    * @param {[object, object]} responseText
    * @param {[function, function]} cb
    */
    info(message, responseText, cb) {
        let msg = $.parseJSON(responseText) || defaultMsg;

        Alert.info(msg.ui || message, {
            onShow: this._handleOnShow('info', msg.debug, cb)
        });
    }

    /**
    *
    * @param {string} message
    * @param {[object, object]} responseText
    * @param {[function, function]} cb
    */
    success(message, responseText, cb) {
        let msg = $.parseJSON(responseText) || defaultMsg;

        Alert.success(msg.ui || message, {
            onShow: this._handleOnShow('success', msg.debug, cb)
        });
    }

    /**
    *
    * @param {string} message
    * @param {[object, object]} responseText
    * @param {[function, function]} cb
    */
    warning(message, responseText, cb) {
        let msg = $.parseJSON(responseText) || defaultMsg;

        Alert.warning(msg.ui || message, {
            onShow: this._handleOnShow('warn', msg.debug, cb)
        });
    }

    /**
     * PRIVATE METHOD, logs to console
     * @param {string} level
     * @param {string} debug
     * @param {[function, function]} cb
     */
    _handleOnShow(level, debug, cb) {
        if (!!debug) {
            switch (level) {
                case 'error':
                    console.error(debug);
                    break;

                case 'warn':
                    console.warn(debug);
                    break;

                default:
                    console.log(debug);
            }
        }
        
        if (cb) cb();
    }

    render() {
        return (
            <Fragment>
                {this.props.children}
                <Alert stack={{ limit: 5 }} timeout={1000 * 10} onShow={this.handleOnShow} effect={"slide"}/>
            </Fragment>
        );
    }
}