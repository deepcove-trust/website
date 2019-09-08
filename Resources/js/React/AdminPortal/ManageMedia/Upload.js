import React, { Component } from 'react';
import CropImage from './UploadWidget/CropImage';
import SelectFile from './UploadWidget/SelectFile';
import UploadFile from './UploadWidget/UploadFile';

import _ from 'lodash';
import $ from 'jquery';

export default class Upload extends Component {
    constructor(props) {
        super(props)

        this.state = {
            file: null,
            triggerUpload: false,
            cropData: null
        }
    }

    fileSelected(evt) {
        console.log(evt.target.files[0])
    }

    updateState(file, triggerUpload, cropData) {
        this.setState({ file, triggerUpload, cropData });
    }

    render() {
        let View = <p>Something went wrong, please refresh your page</p>
        if (!this.state.file) {
            View = (
                <SelectFile cb={this.updateState.bind(this)} />
            );
        } else if (this.state.file && this.state.triggerUpload) {
            View = (
                <UploadFile src={this.state.file}
                    cropData={this.state.cropData}
                    cb={this.updateState.bind(this)}
                    done={this.props.setTab.bind(this, 1)}
                />
            );
        } else if (this.state.file && !this.state.triggerUpload) {
            View = (
                <CropImage image={this.state.file}
                    cb={this.updateState.bind(this)}
                />
            );
        }

        return (
            <div className="row">
                <div className="col-lg-12">
                    <div className="fileuploader">
                        {/*<h3 className="text-center mt-5">Upload FIle</h3>*/}
                        {View} 
                    </div>
                </div>
            </div>
        )
    }
}