import React, { Component, Fragment } from 'react';
import $ from 'jquery';
import Alert from '../Components/Alert';

export default class GoogleMap extends Component {
    getSrc() {
        return $('meta[name=googlemap]').attr("content") || null
    }

    render() {
        if (!this.getSrc())
            return (
                <Alert type="danger">Google Maps Error: Invalid map URL provided, please update the system settings.</Alert>    
            );

        return (
            <Fragment>
                <h3>{this.props.title}</h3>
                <iframe width="100%"
                    frameborder="0"
                    style={{ border: 0, height: 50 + 'vh' }}
                    allowfullscreen=""
                    src={this.getSrc()}>
                </iframe>
            </Fragment>
        )
    }
}