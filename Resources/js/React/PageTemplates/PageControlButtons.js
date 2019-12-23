import React, { Component, Fragment } from 'react';
import { Button, Link } from '../Components/Button';
import { PageUrl } from '../../helpers';
import $ from 'jquery';

const pageBaseUri = `/admin/pages`;

export class EditPageSettings extends Component {
    render() {
        return <Link className={this.props.className || `btn btn-outline-dark btn-block`}
            href={`${pageBaseUri}/${this.props.pageId}`}> Edit Settings </Link>
    }
}

export class ToggleVisibility extends Component {
    toggleVisibility(e) {
        $.ajax({
            method: 'put',
            url: `${pageBaseUri}/${this.props.pageId}/visibility`,
            data: { visbility: e }
        }).done(() => {
            this.props.alert.info(`Page is now ${e ? 'visible' : 'hidden'}`);
            if (this.props.u) return this.props.u();
        }).fail((err) => {
            this.props.alert.error(null, err.responseText);
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
                    Make Private <i className="fas fa-eye-slash" />
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

export class ViewPageDashboard extends Component {
    render() {
        return <Link className={this.props.className || `btn btn-outline-dark btn-block`} href={pageBaseUri}>Pages Dashboard</Link>
    }
}