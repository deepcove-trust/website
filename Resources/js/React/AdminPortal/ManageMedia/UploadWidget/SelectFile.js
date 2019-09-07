import React, { Component, Fragment } from 'react';
import { Button } from '../../../Components/Button';
import ReactTooltip from 'react-tooltip'

export default class SelectFile extends Component {
    imageSelected(evt) {
        evt.preventDefault();
        evt.stopPropagation();

        this.props.cb(
            evt.target.files[0],
            !evt.target.files[0].type.includes("image/")
        )
    }

    render() {
        return (
            <Fragment>
                <div className="row fade1sec">
                    <div className="col-lg-8 offset-lg-2 col-md-6 offset-md-3 col-sm-10 offset-sm-1">
                        <div className="upload-container d-block mx-auto">
                            <div className="upload-box">
                                <p className="upload-container">
                                    <i className="far fa-cloud-upload fa-5x pb-2 d-block text-success" />
                                    Drag and drop here to upload
                                </p>

                                <input type="file"
                                    accept="image/jpg,image/png,audio/mp3,audio/wav,.pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx"
                                    onChange={this.imageSelected.bind(this)}
                                    ref={(x) => this.fileInput = x}
                                />

                                <p className="text-center">or</p>
                                <p className="text-center">
                                    <Button className="btn btn-outline-success" cb={() => this.fileInput.click()}>
                                        Choose a file <i className="far fa-file-search" />
                                    </Button>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
                <ReactTooltip />
                <p className="text-center" data-html={true}
                    data-tip=".mp3, .wav, .jpg, .png, .PDF,<br/>MS Excel (xls/xlsx)<br/>MS Word (doc/docx)<br/>MS PowerPoint (ppt/ppxt)">What files can I upload?
                </p>
            </Fragment>
        )
    }

}