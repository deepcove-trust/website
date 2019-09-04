import React, { Component, Fragment } from 'react';
import { Link, BtnGroup } from '../../Components/Button';
import { isExternalUrl } from '../../../helpers';
import EditCmsButton from './EditCmsButton';

export default class CmsButton extends Component {
    align() {
        if (this.props.button.align == 'block')
            return 'text-right';

        return `text-${this.props.button.align}`;
    }

    color() {
        return `btn-${this.props.button.color}`;
    }

    render() {

        let btn_edit;
        if (this.props.edit && this.props.settings)
            btn_edit = <EditCmsButton id={this.props.id}
                onSave={this.props.onSave.bind(this, 'button')}
                onDelete={this.props.onDelete}
                button={this.props.button}
                settings={this.props.settings} />
        
        // NO Button
        if (!this.props.button) {
            return (
                <div className="text-right mt-2">
                    {btn_edit}
                </div>
            );
        }

        let target;
        let linkText = this.props.button.text;
        if (isExternalUrl(this.props.button.href)) {
            target = '_blank';
            linkText = (
                <Fragment>
                    {`${this.props.button.text}`} &nbsp;
                    <i className="fas fa-external-link-alt" />
                </Fragment>
            );
        }
        return (
            <BtnGroup className={`d-block ${this.align()} mt-2`}>
                <Link className={`btn btn-sm ${this.props.button.align == 'block' ? 'btn-block mb-1' : ''} ${this.color()}`}
                    href={this.props.button.href}
                    target={target}
                >
                    {linkText}
                </Link>
                {btn_edit}
            </BtnGroup>
        );
    }
}