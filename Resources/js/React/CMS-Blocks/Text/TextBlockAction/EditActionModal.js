import React, { Component, Fragment } from 'react';
import { Button } from '../../Components/Button';
import { Modal } from '../../Components/Modal';
import { FormGroup, Input } from '../../Components/FormControl';
import _ from 'lodash';
import $ from 'jquery';

export default class EditActionModal extends Component {

    constructor(props) {
        super(props);        
        this.state = {
            
        }
    }

    cancelEdit() {
       
    }

    saveChanges() {

    }

    toggleModal(id, e) {
        $(`#edit-action-modal`).modal(e ? e : 'toggle');
    }

    render() {
        return (
            <Fragment>
                <Button btnClass="btn btn-warning d-inline" type="button" cb={this.toggleModal.bind(this)}>
                    {this.props.btnText} <i class="fas fa-cog" />
                </Button>

                <Modal id={`edit-action-modal`} title="Customize link">
                    <FormGroup label="Link Text" htmlfor="link-text">
                        <Input type="text" name="link-text" required />
                    </FormGroup>

                    <FormGroup label="Link URL " htmlfor="link-url">
                        <Input type="text" name="link-url" required />
                    </FormGroup>

                    <div>
                        <Button btnClass="btn btn-danger" role="button">
                            Cancel
                        </Button>
                        <Button btnClass="btn btn-success float-right" role="button">
                            Save
                        </Button>
                    </div>
                </Modal>
            </Fragment>
        );

    }
}

// ${this.props.link.id}