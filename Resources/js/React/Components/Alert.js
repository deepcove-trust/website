import React, { Component, Fragment } from 'react';
import Alert from 'react-s-alert';
export default class AlertWrapper extends Component {
    /**
     * Creates the required ref
     * so we can call the alert() 
     * and responseAlert() methods
     */
    componentDidMount() {
        this.props.onRef(this);
    }

    /**
     * Tides up resources after use
     */
    componentWillUnmount() {
        this.props.onRef(undefined);
    }

    /**
     * Fires an alert only using a string for the message
     * @param {string} type
     * @param {message} x
     */
    alert(type, x) {
        switch (type) {
            case "success":
                Alert.success(x);
                break;

            case "info":
                Alert.info(x);
                break;

            case "warning":
                Alert.warning(x);
                break;

            case "error":
                Alert.error(x);
                break;
        }
    }

    /**
     * Fires an alert using an object for the message. Warnings and Errors also log to console
     * @param {string} type
     * @param {object} x
     */
    responseAlert(type, x) {
        switch (type) {
            case "success":
                Alert.success(x.ui);
                break;

            case "info":
                Alert.info(x.ui);
                break;

            case "warning":
                Alert.warning(x.ui, {
                    onShow: function () {
                        console.warn(x.debug);
                    }
                });
                break;

            case "error":
                Alert.error(x.ui, {
                    onShow: function () {
                        console.error(x.debug);
                    }
                });
                break;
        }
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