import React, { Component, Fragment } from 'react';
import $ from 'jquery';
import { Button } from '../../../Components/Button';

export default class UploadFile extends Component {
    constructor(props) {
        super(props);

        this.state = {
            src: this.props.src || null,
            cropData: this.props.cropData || null,
            completed: false
        }
    }

    componentDidMount() {
        var formData = new FormData();
        formData.append('upload', this.state.src.file);
        formData.append('uploadName', this.state.src.name)
        formData.append('uploadType', this.state.src.type);
        if (this.state.cropData) {
            formData.append('cropData', this.state.cropData);
        }


        $.ajax({
            method: 'post',
            url: '/admin/media',
            data: {
                file: this.state.src.file,
                filename: this.state.src.name,
                fileType: this.state.src.type,
                cropData: JSON.stringify(this.state.cropData)
            }
        }).done(() =>
            this.setState({ completed: true })
        ).fail((err) => {
            this.props.alert.error(null, err.responseText);
            this.props.onFail();
        })
    }

    render() {
        if (!this.state.completed) {
            return (
                <div className="text-center mt-5">
                    <i className="fas fa-spinner fa-4x fa-spin" />
                    <h5 className="pt-4">Uploading File</h5>
                </div>
            );
        }
            

        return (
            <div className="text-center pt-5">
                <i className="fas fa-check-circle fa-4x text-success pb-5" />
                <div>
                    <Button className="btn btn-outline-success mx-1" cb={this.props.cb.bind(this, null, false, null)}>
                        Upload another file...
                    </Button>

                    <Button className="btn btn-success mx-1" cb={this.props.done.bind(this)}>
                        I'm Finished!
                    </Button>
                </div>
            </div>
        )
    }
}