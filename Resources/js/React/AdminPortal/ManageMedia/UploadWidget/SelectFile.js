import React, { Component, Fragment } from 'react';
import { Button } from '../../../Components/Button';
import ReactTooltip from 'react-tooltip'

const allowTypes = ["image/jpg", "image/png", "audio/mp3", "audio/wav", ".pdf", ".doc", ".docx", ".xls", ".xlsx", ".ppt", ".ppxt"];
const maxSize = 3000000;//3Mb in Bytes 

export default class SelectFile extends Component {

    imageSelected(evt) {
        evt.preventDefault();
        evt.stopPropagation();

        var file = this.validateFileSize(evt.target.files[0]);
        if (!file) return;

        const FR = new FileReader();
        FR.addEventListener("load", () => {
            this.props.cb(
                {
                    name: file.name,
                    type: file.type,
                    size: file.size,
                    lastModified: file.lastModified,
                    file: FR.result
                },
                !file.type.includes("image/"),
                null
            );
        }, false)

        FR.readAsDataURL(file);

        //this.props.cb(file, !file.type.includes("image/"));
    }

    validateFileSize(file) {
        if (!file) return;
        // Block files that are too large
        if (file.size > maxSize) {
            alert(`${file.name} is too big. The maximum file size is ${maxSize / 1000000}MB`);
            return null;
        }

        return file;
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
                                    accept={allowTypes}
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