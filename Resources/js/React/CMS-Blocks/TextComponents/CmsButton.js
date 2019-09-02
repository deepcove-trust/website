import React, { Component, Fragment } from 'react';
import { Link, BtnGroup, Button } from '../../Components/Button';
import { isExternalUrl } from '../../../helpers';
import { Modal } from '../../Components/Modal';
import $ from 'jquery';
import { FormGroup, Input, Select } from '../../Components/FormControl';

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
        if (this.props.edit)
            btn_edit = <EditCmsButton onSave={this.props.onSave.bind(this, 'button')} button={this.props.button} settings={this.props.settings} />
        
        // NO Button
        if (!this.props.button) {
            return (
                <div className="text-right mt-2">
                    {btn_edit}
                </div>
            );
        }

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
                {btn_edit}
            </BtnGroup>
        );
    }
}

class EditCmsButton extends Component {
    constructor(props) {
        super(props);

        this.state = {
            button: this.props.button || {
                id: null,
                align: "",
                color: "",
                href: "",
                text: ""
            }
        }
    }

    editVal(field, value) {
        let button = this.state.button;
        button[field] = value;
        this.setState({
            button: button
        });
    }

    returnChanges() {
        this.toggleModal('hide');
        this.props.onSave(this.state.button);        
    }

    toggleModal(e) {
        $(`#CmsBtnConfig`).modal(e || 'toggle');
    }

    removeButton() {
        console.log('destroy');
    }

    render() {

        let deleteOption, buttonProps = null;
        if (this.props.button) {
            deleteOption = (
                <a className="dropdown-item" role="presentation" onClick={this.removeButton.bind(this)}>
                    Delete Button <i className="fas fa-exclmation-triangle text-danger" />
                </a>
            )
            buttonProps = {
                text: this.props.button.text,
                href: this.props.button.href,
                color: this.props.button.color,
                align: this.props.button.align,
            };
        }

        return (
            <Fragment>
                <div className="dropdown d-inline ml-1">
                    <button className="btn btn-dark btn-sm dropdown-toggle" data-toggle="dropdown" aria-expanded="false" type="button">
                        <i className="fas fa-cogs" />
                    </button>
                    <div className="dropdown-menu" role="menu">
                        <a className="dropdown-item" role="presentation" onClick={this.toggleModal.bind(this, 'show')}>Configure Button</a>
                        {deleteOption}
                    </div>
                </div>

                <Modal id="CmsBtnConfig" title="Configure Button">
                    <div className="row text-left">
                        <div className="col-12">
                            <FormGroup label="Button Text: " required>
                                <Input cb={this.editVal.bind(this, 'text')} type="text" value={buttonProps ? buttonProps.text : null} />
                            </FormGroup>

                            <FormGroup label="URL: " required>
                                <Input type="href" cb={this.editVal.bind(this, 'href')} value={buttonProps ? buttonProps.href : null} />
                                <p className="my-2">Or create a download link <span className="font-italic">(Coming Sooon!)</span></p>
                                <Button className="btn btn-dark" disabled>
                                    Choose File <i className="fas fa-file-check" />
                                </Button>
                            </FormGroup>
                        </div>

                        <div className="col-lg-6 col-md-12">
                            <FormGroup label="Select Color">
                                <Select cb={this.editVal.bind(this, 'color')}
                                    options={this.props.settings.color}
                                    selected={buttonProps ? buttonProps.color : null} />
                            </FormGroup>
                        </div>

                        <div className="col-lg-6 col-md-12">
                            <FormGroup label="Alignment">
                                <Select cb={this.editVal.bind(this, 'align')}
                                    options={this.props.settings.align}
                                    selected={buttonProps ? buttonProps.align : null} />
                            </FormGroup>
                        </div>

                        <div className="col-12 text-right">
                            <Button className="btn btn-dark" cb={this.returnChanges.bind(this)}>Save</Button>
                        </div>
                    </div>
                </Modal>
            </Fragment>
        )
    }
}