﻿import React, { Component, Fragment } from 'react';
import { ConfirmButton } from '../Components/Button';
import Alert from '../Components/Alert';
import $ from 'jquery';

export default class PageMast extends Component {
    render() {
        if (!!!this.props.page)
            return null;

        return (
            <div className="col-12 pb-4">
                <ConfirmButton btnClass="btn btn-danger float-right disabled">
                    Delete Page &nbsp;
                    <i className="fas fa-trash"></i>
                </ConfirmButton>

                <ToggleVisibility admin={true}
                    page={this.props.page}
                    baseUri={this.props.baseUri}
                    u={this.props.u}
                />

                <ConfirmButton btnClass="btn btn-info float-right disabled">
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
export class LastTouched extends Component {
    render() {
        let update = this.props.page.updated;

        if (!this.props.page.isAuthenticated) {
            // Only administrators should see this button
            return null;
        }

        return (
            <small>
                Updated by: {update.by} on {update.at}
            </small>
        )
    }
}

export class ToggleVisibility extends Component {
    toggleVisibility() {
        $.ajax({
            type: 'post',
            url: `${this.props.baseUri}/${this.props.page.id}/visibility`
        }).done(() => {
            this.props.u();
        }).fail((err) => {
            console.log(err);
        });
    }

    render() {
        if (!this.props.page.isAuthenticated) {
            // Only administrators should see this button
            return null;
        }

        let text;
        if (this.props.page.public) {
            text = (
                <Fragment>
                    Hide Page &nbsp;
                    <i className="fas fa-eye-slash"></i>
                </Fragment>
            )
        } else {
            text = (
                <Fragment>
                    Show Page &nbsp;
                    <i className="fas fa-eye"></i>
                </Fragment>
            )
        }

        return (
            <ConfirmButton btnClass="btn btn-warning float-right" cb={this.toggleVisibility.bind(this)} >
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