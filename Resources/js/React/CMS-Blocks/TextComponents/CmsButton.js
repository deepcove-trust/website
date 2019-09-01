import React, { Component, Fragment } from 'react';
import { Link, BtnGroup, Button } from '../../Components/Button';
import { isExternalUrl } from '../../../helpers';

export default class CmsButton extends Component {
    align() {
        if (this.props.button.align == 'block')
            return 'text-right';

        return `text-${this.props.button.align}`;
    }

    color() {
        return `btn-${this.props.button.color}`
    }
    render() {
        let btnEdit;
        if (this.props.edit) {
            let btnText = this.props.button ? "Edit" : "Add";
            
            btnEdit = (
                <Button className={`btn btn-dark btn-sm border-${this.props.button ? this.props.button.color : 'info'}`}>
                    {btnText} Button <i className="fas fa-cog"/>
                </Button>
            )
        }
        //IF EDIT MODE, NO BUTTON
        if (!this.props.button)
            return (
                <div className="mt-2 text-right">
                    {btnEdit}
                </div>
            );

        //IF EDIT MODE, SOME BUTTON

        //ELSE
        let linkText = this.props.button.text;
        if (isExternalUrl(this.props.button.href)) {
            linkText = (
                <Fragment>
                    {`${this.props.button.text}  `}
                    <i className="fas fa-external-link-alt" />
                </Fragment>
            );
        }
        return (
            <BtnGroup className={`d-block ${this.align()} mt-2`}>
                <Link className={`btn btn-sm ${this.props.button.align == 'block' ? 'btn-block' : ''} ${this.color()}`}
                    href={this.props.button.href}
                >
                    {linkText}
                </Link>
                {btnEdit}
            </BtnGroup>
        );
    }
}