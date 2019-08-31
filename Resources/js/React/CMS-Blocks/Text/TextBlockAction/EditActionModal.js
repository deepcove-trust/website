import React, { Component, Fragment } from 'react';
import { Button } from '../../../Components/Button';
import TextBlockAction from '../TextBlockAction';
import { Modal } from '../../../Components/Modal';
import { Select, Checkbox } from '../../../Components/FormControl';
import { FormGroup, Input } from '../../../Components/FormControl';
import _ from 'lodash';
import $ from 'jquery';


export default class EditActionModal extends Component {

    constructor(props) {
        super(props);
        this.state = {
            link: _.cloneDeep(this.props.link)
        }
    }

    editVal(field, val) {
        let link = _.cloneDeep(this.state.link);
        link[field] = val;
        
        this.setState({
            link: link
        });
    }

    returnChanges() {
        this.props.cb(this.state.link)
        this.toggleModal();
    }

    toggleModal(slot, e) {
        $(`#edit-action-modal-${this.props.slotNo}`).modal(e ? e : 'toggle');
    }

    render() {
        return (
            <Fragment>
                <Button btnClass="btn btn-sm btn-info d-inline" type="button" cb={this.toggleModal.bind(this, this.props.slot)}>
                    {this.props.btnText} &nbsp; <i className="fas fa-cog" />
                </Button>

                <Modal size="large" id={`edit-action-modal-${this.props.slotNo}`} title="Customize link">

                    <div className="row">

                        <div className="col-lg-8">
                            <FormGroup htmlFor="link-text" label="Link Text">
                                <Input type="text" id="link-text" value={this.state.link ? this.state.link.text : undefined} cb={this.editVal.bind(this, 'text')} required />
                            </FormGroup>

                            <FormGroup htmlFor="link-href" label="Link Destination">
                                <Input type="url" id="link-href" value={this.state.link ? this.state.link.href : undefined} cb={this.editVal.bind(this, 'href')} required />
                            </FormGroup>

                            <div className="row">
                                <div className="col-lg-4">
                                    <FormGroup htmlFor="link-color" label="Link Color">
                                        <Select id="link-color"
                                            options={this.props.settings.colors}
                                            selected={this.state.link ? this.state.link.align : null}
                                            cb={this.editVal.bind(this, 'color')} />
                                    </FormGroup>
                                </div>
                                <div className="col-lg-4">
                                    <FormGroup htmlFor="link-align" label="Link Alignment">
                                        <Select id="link-align"
                                            options={this.props.settings.alignments}
                                            selected={this.state.link ? this.state.link.align : null}
                                            cb={this.editVal.bind(this, 'align')} />
                                    </FormGroup>
                                </div>
                                <div className="col-lg-4">
                                    <Checkbox id="link-isButton" label="Show as Button" checked={this.state.link.isButton} cb={this.editVal.bind(this, 'isButton')} />
                                </div>
                            </div>
                        </div>

                        <div className="col-lg-4">
                            <h5 className="text-center">Preview</h5>
                            <TextBlockAction link={this.state.link} />
                        </div>

                    </div>

                    <div className="float-right">
                        <Button btnClass="btn btn-danger mr-2" cb={this.toggleModal.bind(this)}>
                            Cancel &nbsp; <i className="fas fa-times" />
                        </Button>
                        <Button btnClass="btn btn-success" cb={this.returnChanges.bind(this)}>
                            Accept &nbsp; <i className="fas fa-check" />
                        </Button>
                    </div>

                </Modal>
            </Fragment >
        );

    }
}