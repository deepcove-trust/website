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
        let pageLinks;
        if (this.props.pages && this.props.pages.length > 0) {            
            pageLinks = this.props.pages.map((page) => {
                return <a class="dropdown-item" role="presentation" onClick={this.addLink.bind(this, page.id)}>{page.name}</a>
            });
        } else {
            pageLinks = <a className="dropdown-item disabled" role="presentation">All pages have been assigned</a>
        }

        return (
            <div class="dropdown">
                <button class="btn btn-dark btn-sm float-right dropdown-toggle" data-toggle="dropdown" aria-expanded="false" type="button"> Add Page </button>
                <div class="dropdown-menu" role="menu">
                    {pageLinks}
                </div>
            </div>
        )
    }
}