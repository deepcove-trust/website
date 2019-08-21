import React, { Component } from 'react';

export default class Timestamps extends Component {
    render() {
        return (
            <div className="row">
                <div className="col-lg-6 col-md-12">
                    <label>Account Created</label>
                    <p>{this.props.timestamps.signup}</p>
                </div>

                <div className="col-lg-6 col-md-12">
                    <label>Last Login</label>
                    <p>{this.props.timestamps.lastLogin}</p>
                </div>
            </div>
        )
    }
}