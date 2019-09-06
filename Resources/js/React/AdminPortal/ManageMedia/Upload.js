import React, { Component } from 'react';
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

    render() {
        let View;
        if (!this.state.file) {
            View = (
                <SelectFile cb={(file, triggerUpload) => {
                    this.setState({
                        file: file,
                        triggerUpload: !triggerUpload,
                    })
                }} />
            )
        } else if (this.state.file && this.state.triggerUpload) {
            View = <p>It's UPLOADTIME</p>;//Upload Component
        } else if (this.state.file && !this.state.triggerUpload) {
            View = <p>Image Croper</p>;//Crop Image
        } else {
            View = <p>Something went wrong, please refresh your page</p>
        }

        return (
            <div className="row mt-5">
                <div className="col-lg-12">
                    <div className="fileuploader">
                        <h3 className="text-center mt-5">Upload Centre</h3>
                        {View} 
                    </div>
                </div>
            </div>
        )
    }
}