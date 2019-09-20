import React, { Component } from 'react';
import Media from '../../CMS-Blocks/Media';
import { Button } from '../../Components/Button';

export default class Details extends Component {
    render() {
        return (
            <div className="row">
                <div className="col-lg-4 col-md-6 col-sm-12">
                    <Media file={this.props.data} />
                </div>

                <div className="col-lg-4 col-md-6 col-sm-12">
                    <h3>Detials</h3>
                    <dl>
                        <dt>Name:</dt>
                        <dd>{this.props.data.name}.{this.props.data.mediaType.value.toLowerCase()}</dd>

                        <dt>Size on Disk (Includes all Versions):</dt>
                        <dd>.</dd>

                        <dt>Source</dt>
                        <dd>.</dd>
                    </dl>

                    <Button className="btn btn-dark btn-sm mx-1" disabled>
                        Edit Details <i className="fas fa-pencil"/>
                    </Button>

                    <Button className="btn btn-info btn-sm mx-1" disabled>
                        Re-Crop Image <i className="far fa-crop"/>
                    </Button>

                    <Button className="btn btn-danger btn-sm mx-1" disabled>
                        Delete <i className="far fa-trash" />
                    </Button>
                </div>

                <div className="col-lg-4 col-md-6 col-sm-12">
                    <h3>Locations</h3>

                    <p>Displays where the file is used. Files used in the mobile application or website cannot be deleted:</p>

                    <dl>
                        <dt>Website</dt>
                        <dd>n/a</dd>

                        <dt>Mobile Application</dt>
                        <dd>n/a</dd>
                    </dl>
                </div>
            </div>
        )
    }
}