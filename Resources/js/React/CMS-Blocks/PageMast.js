import React, { Component, Fragment } from 'react';
import { ConfirmButton, ConfirmModal, Link } from '../Components/Button';
import Alert from '../Components/Alert';
import $ from 'jquery';
import { PageUrl } from '../../helpers';

export default class PageMast extends Component {

    render() {
        if (!this.props.page)
            return null;

        if (!this.props.page.settings)
            return null;

        return (
            <div className="col-12 pb-4">
                <BackToDashboard/>

                <ToggleVisibility admin={true}
                    page={this.props.page}
                    baseUri={this.props.baseUri}
                    u={this.props.u}
                />

                <ConfirmButton btnClass="btn btn-info float-right mx-1 disabled">
                    View Page History &nbsp;
                    <i className="far fa-history"></i>
                </ConfirmButton>

                <h1 className="mb-1">{this.props.page ? this.props.page.name : ""}</h1>
                <LastTouched page={this.props.page} />

                <VisibilityBanner public={this.props.page.public} />
            </div>
        )
    }
}

class BackToDashboard extends Component {
    render() {
        return (
            <Link btnClass="btn-info float-right mx-1" href={`/admin/web/pages?filter=main`}>
                Page Dashboard <i className="far fa-columns" />
            </Link>
        )
    }
}

export class LastTouched extends Component {
    render() {
        let update = this.props.page.updated;

        return (
            <small>
                Updated by: {update.by} on {update.at}
            </small>
        )
    }
}

export class ToggleVisibility extends Component {
    getClass() {
        return this.props.btnClass || `btn btn-info float-right ${this.props.block ? 'btn-block' : ''}`;
    }

    toggleVisibility() {
        $.ajax({
            type: 'post',
            url: `${this.props.baseUri}/${this.props.page.id}/visibility`
        }).done(() => {
            this.props.u();
        }).fail((err) => {
            console.log(`[PageMast@ToggleVisibility] Error changing the visbility of page ${this.props.page.id}: ${err.ResponseText}`);
        });
    }

    render() {
        let text;
        if (this.props.page.public) {
            text = (
                <Fragment>
                    Make Private
                </Fragment>
            )
        } else {
            text = (
                <Fragment>
                    Make Public
                </Fragment>
            )
        }

        return (
            <ConfirmButton btnClass={this.getClass()} cb={this.toggleVisibility.bind(this)} >
                {text}
            </ConfirmButton>
        )
    }
}

export class VisibilityBanner extends Component {
    render() {
        if (this.props.public) {
            return null;
        }

        return (
            <Alert type="danger">This page is hidden! Only authenticated users can see this page.</Alert>
        )
    }
}