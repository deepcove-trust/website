import React, { Component, Fragment } from 'react';
import $ from 'jquery';

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
            data: formData,
            processData: false
        }).done((data) => {
            console.log("Wahoo", data);
        }).fail((err) => {
            console.log(err);
        })
    }

    render() {
        if(!this.state.completed)
            return <p>It's upload time</p>;

        return <p>We're done</p>
    }
}