import React, { Component } from 'react';
import CropImage from './UploadWidget/CropImage';
import SelectFile from './UploadWidget/SelectFile';

import _ from 'lodash';
import $ from 'jquery';

export default class Upload extends Component {
    constructor(props) {
        super(props)

        this.state = {
            file: null,
            triggerUpload: false
        }
    }

    fileSelected(evt) {
        console.log(evt.target.files[0])
    }

    updateState(file, triggerUpload) {
        console.log(null, file, triggerUpload)
        this.setState({ file, triggerUpload });
    }

    render() {
        let View;
        if (!this.state.file) {
            View = (
                <SelectFile cb={this.updateState.bind(this)} />
            )
        } else if (this.state.file && this.state.triggerUpload) {
            View = <p>It's UPLOADTIME</p>;//Upload Component
        } else if (this.state.file && !this.state.triggerUpload) {
            View = <CropImage image={this.state.file} cb={this.updateState.bind(this)} />
        } else {
            View = <p>Something went wrong, please refresh your page</p>
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