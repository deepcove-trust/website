import React, { Component } from 'react';
import { Button } from '../../Components/Button';

import _ from 'lodash';
import $ from 'jquery';
import Panel from '../../Components/Panel';

export default class Upload extends Component {
    constructor(props) {
        super(props)

        this.state = {
            files: []
        }
    }


    // File uploaded
    onChange(evt) {
        let files = [];
        for (let i = 0; i < evt.target.files.length; i++) {
            let file = evt.target.files[i];
                
            files.push({
                name: file.name,
                size: file.size,
                type: file.type,
                previewUrl: URL.createObjectURL(file),
                file: file
            });
        }

        this.setState({
            files: this.state.files.concat(files)
        });
    }

    sendToServer() {
        $.ajax({
            method: 'post',
            url: '/admin/media',
            data: this.state.files.map((file) => {
                return file.file;
            })
        }).fail((err) => {
            console.error(err.responseText);
        })
    }

    render() {
        let uploadBtn;
        if (this.state.files.length > 0) {
            uploadBtn = (
                <div className="col-12 pb-2">
                    <Button className="btn btn-dark d-block mx-auto" cb={this.sendToServer.bind(this)}>Upload Files <i className="fas fa-upload" /></Button>
                </div>
            )
        }

        return (
            <div className="row mt-5">
                <div className="col-lg-12">
                    <div className="fileuploader">
                        <h3 className="text-center mt-5">File Upload</h3>
                        <h6 className="text-center text-muted card-subtitle mb-2">MP3, PNG, JPG, PDF, DOCX</h6>

                        <div className="dragable-container">
                            <div className="text-center" style={{ 'position': 'relative'}}>
                                <input type="file" multiple
                                    onChange={this.onChange.bind(this)}
                                />

                                <p className="fileuploader">Drag files or Click Here to begin the upload</p>
                            </div>
                        </div>

                        <div className="row" style={{ 'marginLeft': '10px', 'marginRight': '10px' }}>
                            
                            {uploadBtn}
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}