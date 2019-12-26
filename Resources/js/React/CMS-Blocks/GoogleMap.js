import React, { Component, Fragment } from 'react';
import { StaticAlert } from '../Components/Alert';

export default class GoogleMap extends Component {
    getSrc() {
        return this.props.config || null
    }

    render() {
        if (!this.getSrc())
            return (
                <StaticAlert type="danger">Google Maps Error: Invalid map URL provided, please update the system settings.</StaticAlert>
            );

        return (
            <Fragment>
                <h3>{this.props.title}</h3>
                <p className="text-danger font-weight-bold pb-2">
                    Deep Cove is not accessible by road.
                </p>
                <iframe width="100%"
                    frameBorder="0"
                    style={{ border: 0, height: 50 + 'vh' }}
                    allowFullScreen=""
                    src={this.getSrc()}>
                </iframe>
            </Fragment>
        )
    }
}