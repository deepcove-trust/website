import React, { Component } from 'react';
import { Button } from '../../../Components/Button';
import Delete from './Delete';
import { CardBody } from '../../../Components/Card';

export default class MetaButtons extends Component {
    render() {
        let controls = !this.props.edit ? (
            <div className="row">
                <div className="col-md-4 col-sm-12">
                    <Button className="btn btn-dark btn-sm" cb={this.props.setEdit.bind(this, true)}>
                        Edit Details
                    </Button>
                </div>

                <div className="col-md-4 col-sm-12">
                    <Button className="btn btn-dark btn-sm" disabled>
                        Crop Image  <i className="far fa-crop" />
                    </Button>
                </div>

                <div className="col-md-4 col-sm-12">
                    <Delete text="Delete" id={this.props.fileId || this.props.file.id || null}
                        alert={this.props.alert}
                        cb={this.props.deleteCb}
                    />
                </div>
            </div>
        ) : (
            <div className="row">
                <div className="col-md-4 offset-md-4 col-sm-12 text-right">
                    <Button className="btn btn-dark btn-sm" cb={this.props.cancel}>
                        Cancel  <i className="fas fa-times" />
                    </Button>
                </div>

                <div className="col-md-4 col-sm-12">
                    <Button className="btn btn-info btn-sm" cb={this.props.saveChanges} pending={this.props.pending}>
                        Save <i className="fas fa-check" />
                    </Button>
                </div>
            </div>
        )

        return (
            <CardBody className="card-body bg-white text-center sticky-top">
                {controls}
            </CardBody>
        )
    }
}