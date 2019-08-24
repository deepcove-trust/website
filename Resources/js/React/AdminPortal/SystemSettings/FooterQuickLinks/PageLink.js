import React, { Component } from 'react';
import $ from 'jquery';

export default class PageRow extends Component {
    removeLink(pageId) {
        $.ajax({
            type: 'delete',
            url: `${this.props.baseUri}/quicklink/${pageId}`
        }).done(() => {
            this.props.u();
        }).fail((err) => {
            console.error(`[QuicklinksPages@removeLink] Error removing quicklink: `, err.responseText);
        });
    }

    render() {
        return (
            <tr>
                <td>
                    <PageLink page={this.props.page} />
                </td>
                <td>
                    <button className="btn btn-danger btn-sm float-right" type="button" onClick={this.removeLink.bind(this, this.props.page.id)}>
                        Remove Quick Link <i className="fas fa-times"></i>
                    </button>
                </td>
            </tr>
        )
    }
}

class PageLink extends Component {
    url(x) {
        return x.replace(/\s+/g, '-').toLowerCase();
    }

    render() {
        let page = this.props.page;

        return (
            <a href={page.section != 'education' ? `/${this.url(page.name)}` : `/education/${this.url(page.name)}`}>
                {page.name}
            </a>
        )
    }
}