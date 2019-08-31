﻿import React, { Component } from 'react';
import PreviewCard from './PreviewCard';
import { Button, ConfirmModal, Link } from '../../Components/Button';
import { ToggleVisibility } from '../../CMS-Blocks/PageMast';
import $ from 'jquery';

export default class PagePreview extends Component {
    render() {
        let visibility = (
            <span className="text-primary">This page is visible to the public</span>
        );
        if (!this.props.page.public)
            visibility = (
                <span className="text-danger font-weight-bold">This page is private!</span>
            );

        return (
            <PreviewCard title={this.props.page.name}>
                <p className="text-center">{this.props.page.description}</p>

                <hr />
                <p className="text-center">{visibility}</p>
                <hr />

                <div className="row">
                    <div className="col-md-6 col-sm-12 pb-2 px-1">
                        <Link btnClass="btn-outline-dark btn-block" href={`/${this.props.page.absoluteUrl}`}>
                            View
                        </Link>
                    </div>

                    <div className="col-md-6 col-sm-12 pb-2 px-1">
                        <Link btnClass="btn-outline-dark btn-block" href={`/admin/pages/${this.props.page.id}`}>
                            Edit Settings
                        </Link>
                    </div>

                    <div className="col-md-6 col-sm-12 pb-2 px-1">
                        <ToggleVisibility page={this.props.page}
                            btnClass="btn btn-outline-dark btn-block"
                            baseUri={`/api/page`}
                            block={true}
                            u={this.props.u}
                        />
                    </div>

                    <div className="col-md-6 col-sm-12 px-1">
                        <DeletePage page={this.props.page}
                            className="btn btn-outline-dark btn-block"
                            u={this.props.u} />
                    </div>
                </div>
            </PreviewCard>
        )
    }
}

class DeletePage extends Component {
    deletePage() {
        $.ajax({
            type: 'delete',
            data: this.props.page.id,
            url: `/api/page/${this.props.page.id}`
        }).done(() => {
            this.props.u();
        }).fail((err) => {
            console.log(`[PagePreview@deletePage] Error deleting page ${this.props.page.id}: ${err.ResponseText}`);
        });
    }

    render() {
        return (
            <ConfirmModal btnClass="btn btn-outline-danger btn-block"
                question="delete page"
                explanation="This action cannot be undone, all information will be lost"
                actionText="YES Delete Page!"
                confirmPhrase={this.props.page.name}
                cb={this.deletePage.bind(this)}
            >
                Delete <i className="fas fa-exclamation-triangle"></i>
            </ConfirmModal>
        )
    }
}