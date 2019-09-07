import React, { Component, Fragment } from 'react';
import ReactCrop from 'react-image-crop';
import { Button } from '../../../Components/Button';
import Panel from '../../../Components/Panel';

export default class CropImage extends Component {
    constructor(props) {
        super(props);

        this.state = {
            src: URL.createObjectURL(this.props.image),
            crop: {
                unit: 'px',
                x: 0,
                y: 0,
                aspect: 1/1
            }
        }
    }

    onCrop(crop) {
        this.setState({crop})
    }

    convertSize(v) {        
        if (!!v || v == 0) return 'n/a';

        var sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
        var i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
        return Math.round(bytes / Math.pow(1024, i), 2) + ' ' + sizes[i];
    }

    render() {
        return (
            <div className="row fade1sec">
                <div className="col-12 pb-2">
                    <Button className="btn btn-dark" cb={this.props.cb.bind(this, null, false)}>
                        Go Back <i className="far fa-undo" />
                    </Button>
                    <Button className="btn btn-dark float-right">
                        Upload Without Cropping <i className="fas fa-upload"/>
                    </Button>
                </div>
                <div className="col-lg-8 col-md-10 col-sm-12 text-center" style={{ 'position': 'relative' }}>
                    <div style={{ 'position': 'absoulte', 'left': '0px', 'top': '0px', 'width': '100%', 'backgroundColor': 'rgba(34, 75, 102, 0.07)' }}>
                        <ReactCrop crop={this.state.crop}
                            src={this.state.src}
                            onChange={this.onCrop.bind(this)}
                        />
                    </div>
                </div>

                <div className="col-lg-4 colmd-2 col-sm-12">
                    <Panel>
                        <h5>Help</h5>
                        <p><i className="fas fa-check text-success" /> Only crop an image to exclude content</p>
                        <p><i className="fas fa-times text-danger" /> Don't reduce image size unnecessarily </p>
                        <p>Smaller versions of this image will be used for smaller devices</p>
                                                

                        Stats:
                        <div className="table-responsive">
                            <table className="table table-striped table-sm">
                                <thead>
                                    <tr>
                                        <th></th>
                                        <th>Before</th>
                                        <th>After</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td>Dimensions</td>
                                        <td>HxW px</td>
                                        <td>{this.state.crop.height}x{this.state.crop.width} px</td>
                                    </tr>
                                    <tr>
                                        <td>File Size</td>
                                        <td></td>
                                        <td></td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>


                        <Button className="btn btn-success d-block mx-auto">
                            Crop and Upload <i className="far fa-crop" />
                        </Button>
                    </Panel>
                </div>
            </div>

        )
    }
}