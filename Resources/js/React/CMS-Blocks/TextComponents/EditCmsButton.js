import React, { Component, Fragment } from 'react';
import { FormGroup, Input, Select } from '../../Components/FormControl';
import { Button } from '../../Components/Button';
import { Modal } from '../../Components/Modal';
import $ from 'jquery';

export default class EditCmsButton extends Component {
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
        $(`#cmsBtnConfig_${this.props.id}`).modal(e || 'toggle');
    }

    render() {
        if (!this.props.settings) return;


        let deleteOption, buttonProps = null;
        if (this.props.button) {
            deleteOption = (
                <a className="dropdown-item" role="presentation" onClick={this.props.onDelete}>
                    Delete Button <i className="fas fa-exclmation-triangle text-danger" />
                </a>
            )
            buttonProps = {
                text: this.state.button.text,
                href: this.state.button.href,
                color: this.state.button.color,
                align: this.state.button.align,
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

                <Modal id={`cmsBtnConfig_${this.props.id}`} title="Configure Button">
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

                        <div className="col-6 text-center px-3 ">
                            <p className="float-left mt-2">Preview &nbsp; &nbsp;</p>
                            <Button className={`btn btn-${this.state.button.color} float-right`}>{this.state.button.text}</Button>
                        </div>

                        <div className="col-6 text-right">
                            <Button className="btn btn-dark" cb={this.returnChanges.bind(this)}>Save</Button>
                        </div>
                    </div>
                </Modal>
            </Fragment>
        )
    }
}