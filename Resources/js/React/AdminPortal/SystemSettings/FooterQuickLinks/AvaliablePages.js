import React, { Component } from 'react';
import $ from 'jquery';

export default class AvaliablePages extends Component {
    handleAdd(id) {
        $.ajax({
            type: 'post',
            url: `${this.props.baseUri}/${id}/${this.props.sectionId}`
        }).done(() => {
            this.props.u();
            this.props.alert.success('Quicklink added!');
        }).fail((err) => {
            tihs.props.alert.error(null, err.responseText);
        });
    }

    render() {
        let links = this.props.pages && this.props.pages.length > 0 ? (
            this.props.pages.map((page, key) => {
                return <button className="dropdown-item" role="presentation" onClick={this.handleAdd.bind(this, page.id)} key={key}>{page.name || "Home"}</button>
            })
        ) : <button className="dropdown-item disabled" role="presentation" disabled>All pages have been assigned</button>;

        return (
            <div className="dropleft">
                <button className="btn btn-dark btn-sm float-right dropdown-toggle" data-toggle="dropdown" aria-expanded="galse" type="button"> Add Page </button>
                <div className="dropdown-menu" role="menu">
                    {links}
                </div>
            </div>
        )
    }
}