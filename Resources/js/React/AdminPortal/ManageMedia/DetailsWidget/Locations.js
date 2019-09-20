import React, { Component, Fragment } from 'react';

export default class MediaLocations extends Component {
    render() {
        return (
            <Fragment>
                <h3>Locations</h3>

                <p>Displays where the file is used. Files used in the mobile application or website cannot be deleted:</p>

                <dl>
                    <dt>Website</dt>
                    <dd>{this.props.file.location ? this.props.file.location.website.join(', ') : 'n/a'}</dd>

                    <dt>Mobile Application</dt>
                    <dd>{this.props.file.location ? this.props.file.location.application.join(', ') : 'n/a'}</dd>
                </dl>
            </Fragment>
        )
    }
}