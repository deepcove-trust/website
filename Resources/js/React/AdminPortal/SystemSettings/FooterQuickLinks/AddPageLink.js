import React, { Component } from 'react';
import $ from 'jquery';



export default class SelectPage extends Component {
    addLink(id) {
        $.ajax({
            type: 'post',
            url: `${this.props.baseUri}/quicklink/${id}/${this.props.sectionId}`
        }).done(() => {
            this.props.u();
        }).fail((err) => {
            console.error(`[QuicklinksPages@removeLink] Error removing quicklink: `, err.responseText);
        });
    }

    render() {
        let disabled = !this.props.pages || this.props.pages && this.props.pages.length == 0;
        let pageLinks;
        if (this.props.pages) {
            pageLinks = this.props.pages.map((page) => {
                return <a class="dropdown-item" role="presentation" onClick={this.addLink.bind(this, page.id)}>{page.name}</a>
            });
        }

        return (
            <div class="dropdown">
                <button class="btn btn-info btn-sm float-right dropdown-toggle" data-toggle="dropdown" aria-expanded="false" type="button" disabled={disabled}> Add Page </button>
                <div class="dropdown-menu" role="menu">
                    {pageLinks}
                </div>
            </div>
        )
    }
}