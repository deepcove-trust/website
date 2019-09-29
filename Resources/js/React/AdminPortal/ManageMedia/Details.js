import React, { Component } from 'react';
import Media from '../../CMS-Blocks/Media';
import { Button } from '../../Components/Button';
import MetaData from './DetailsWidget/Metadata';
import Delete from './DetailsWidget/Delete';

export default class Details extends Component {
    render() {
        return (
            <div className="row">
                <div className="col-lg-4 col-md-6 col-sm-12">
                    <Media file={this.props.data} />

                    <div className="mt-2">
                        <Button className="btn btn-info btn-sm mx-1" disabled>
                            Re-Crop Image <i className="far fa-crop" />
                        </Button>

                        <Delete id={this.props.data.id} />
                    </div>
                </div>

                <div className="col-md-6 col-sm-12">
                    <MetaData file={this.props.data}
                        cb={null}
                    />
                </div>
            </div>
        )
    }
}