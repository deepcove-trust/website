import React, { Component, Fragment } from 'react';
import { Button, Link } from '../Components/Button';
import $ from 'jquery';
import { PageUrl } from '../../helpers';

const apiBaseUri = `/api/pages`;
const pageBaseUri = `/admin/pages`;

export class EditPageSettings extends Component {
    render() {
        return (
            <Link className={this.props.className || `btn btn-outline-dark btn-block`}
                href={`${pageBaseUri}/${this.props.pageId}`}> Edit Settings </Link>
        )
    }
}

export class ToggleVisibility extends Component {
    toggleVisibility(e) {
        $.ajax({
            method: 'put',
            url: `${pageBaseUri}/${this.props.pageId}/visibility`,
            data: {visbility: e}
        }).done(() => {
            if (this.props.u) return this.props.u();
        }).fail((err) => {
            // redo this
            console.error(err);
        })
    }

    render() {
        let text = (
            <Fragment>
                Make Public <i className="fas fa-eye" />
            </Fragment>
        )

        if (this.props.public) {
            text = (
                <Fragment>
                    Make Private <i className="fas fa-eye-slash"/>
                </Fragment>
            )
        }

        return (
            <Button className={this.props.className || `btn btn-dark btn-sm`} cb={this.toggleVisibility.bind(this, !this.props.public)}>
                {text}
            </Button>    
        )
    }
}

export class ViewPage extends Component {
    render() {
        return (
            <Link className={this.props.className || 'btn btn-outline-dark btn-block'}
                href={this.props.href || PageUrl(this.props.pageName, this.props.pageSection)}
            > View </Link>
        )
    }
}