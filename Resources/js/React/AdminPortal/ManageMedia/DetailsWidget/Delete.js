import React, { Component } from 'react';
import { ConfirmButton } from '../../../Components/Button';
import $ from 'jquery';

const baseUri = '/admin/media';

export default class Delete extends Component {
    delete(id) {
        if (!id) {
            throw "No ID provided, cannot delete media.";
        }

        $.ajax({
            method: 'delete',
            url: `${baseUri}/${id}`
        }).done(() => {
            this.props.alert.success("File deleted!")
            if (this.props.cb) {
                this.props.cb();
            }
        }).fail((err) => {
            this.props.alert.error(null, err.responseText)
        })
    }

    render() {
        return ( 
            <ConfirmButton className={this.props.className || "btn btn-danger btn-sm"} cb={this.delete.bind(this, this.props.id)}>
                {this.props.text} <i className="fas fa-trash"/>
            </ConfirmButton>
        )
    }
}