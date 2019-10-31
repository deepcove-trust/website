import React, { Component } from 'react';
import PreviewCard from './PreviewCard';
import { ConfirmModal } from '../../Components/Button';
import { ToggleVisibility, ViewPage, EditPageSettings } from '../../PageTemplates/PageControlButtons';
import $ from 'jquery';

export default class PagePreview extends Component {
    render() {
        let visibility = <span className="text-primary">This page is visible to the public</span>

        if (!this.props.page.public) {
            visibility = (
                <span className="text-danger font-weight-bold">This page is private!</span>
            );
        }

        return (
            <PreviewCard className="mb-2" title={this.props.page.name} imgurl={`/images/templates/${this.props.page.template.id}.png`}>
                <p className="text-center">{this.props.page.description}</p>

                <hr />
                <p className="text-center">{visibility}</p>
                <hr />

                <div className="row">
                    <div className="col-md-6 col-sm-12 pb-2 px-1">
                        <ViewPage href={`/${this.props.page.absoluteUrl}`} />
                    </div>

                    <div className="col-md-6 col-sm-12 pb-2 px-1">
                        <EditPageSettings pageId={this.props.page.id} />
                    </div>

                    <div className="col-md-6 col-sm-12 pb-2 px-1">

                        <ToggleVisibility page={this.props.page}
                            className="btn btn-outline-dark btn-block"
                            public={this.props.page.public}
                            pageId={this.props.page.id}
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
            url: `/admin/pages/${this.props.page.id}`
        }).done(() => {
            this.props.u();
        }).fail((err) => {
            console.log(`[PagePreview@deletePage] Error deleting page ${this.props.page.id}: ${err.ResponseText}`);
        });
    }

    render() {
        
        return (
            <ConfirmModal id={this.props.page.id}
                question="delete page"
                className="btn btn-outline-danger btn-block"
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