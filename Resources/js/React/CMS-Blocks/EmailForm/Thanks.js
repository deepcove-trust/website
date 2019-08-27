import React, { Component, Fragment } from 'react';

export default class MailSent extends Component {
    render() {
        return (
            <Fragment>
                <div className="fade1sec text-dark text-center mt-5 pt-5">
                    <i className="fas fa-check-circle pb-3 fa-5x"></i>
                    <h5 className="display-4 mb-2" style={{ 'font-size': 'xx-large' }}>Thanks for the Email!</h5>
                </div>
            </Fragment>
        )
    }
}