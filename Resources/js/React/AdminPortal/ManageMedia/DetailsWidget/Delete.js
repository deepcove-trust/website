import React, { Component } from 'react';
import { Button } from '../../../Components/Button';
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
            if (this.props.cb) {
                this.props.cb();
            }
        }).fail((err) => {
            console.error(`[DetailsWidget/Delete@delete] Error deleting media: `, err.responseText);
        })
    }

    render() {
        return ( 
            <Button className="btn btn-outline-danger btn-sm" cb={this.delete.bind(this, this.props.id)}>
                Delete <i className="fas fa-trash"/>
            </Button>
        )
    }
}