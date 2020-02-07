import React, { Component, Fragment } from 'react';
import $ from 'jquery';

import { FormGroup, Input, Checkbox } from '../../../../Components/FormControl';
import SelectMedia from '../../../../CMS-Blocks/SelectMedia';
import { Button } from '../../../../Components/Button';
import OverlayImage from '../../../../Components/OverlayImage';

export default class QuizSettings extends Component {

    constructor(props) {
        super(props);

        this.state = {
            showModal: false,
            editMode: this.props.mustSaveSettingsFirst
        }
    }

    componentDidMount() {
        $('.d-square').each(() => $(this).css('minHeight', $(this).offsetWidth));
    }
    
    cancelEdit() {
        this.props.onCancel();
        this.setState({editMode: false})
    }

    setModal(showModal) {
        this.setState({
            showModal
        });
    }

    handleQuizSettingsFormSubmit(e) {
        e.preventDefault();
        this.props.onSaveSettings(() => {
            this.setState({
                editMode: false
            })
        });
    }

    handleStartEdit() {
        this.props.onEdit();
        this.setState({
            editMode: true
        })
    }

    render() {

        let disabled = !this.state.editMode;

        let checkBoxes = (
            <Fragment>
                <FormGroup className="d-inline-block" htmlFor="shuffle" label="Shuffle Questions?">
                    <Checkbox disabled={disabled} tooltip="Questions will be shown in random order" checked={this.props.quiz.shuffle} className="ml-2 float-right" id="shuffle" cb={this.props.updateField.bind(this, 'shuffle')} />
                </FormGroup>
                <FormGroup className="d-inline-block" htmlFor="active" label="Enable Quiz?">
                    <Checkbox disabled={disabled} tooltip="Quiz will be downloaded to users devices" checked={this.props.quiz.active} className="ml-2 float-right" id="active" cb={this.props.updateField.bind(this, 'active')} />
                </FormGroup>
            </Fragment>
        )

        let buttons = !this.state.editMode
            ? (
                <div className="text-right">
                    <Button className={`btn btn-sm btn-dark ${this.props.pendingEdit ? "d-none" : ""}`} cb={this.handleStartEdit.bind(this)} >Edit &nbsp; <i className="fas fa-pencil"></i></Button>
                </div>
            )
                : (
                <div className="text-right">
                    <Button className={`btn btn-sm btn-danger mr-1 `} cb={this.cancelEdit.bind(this)} >Cancel &nbsp; <i className="fas fa-times"></i></Button>
                    <Button className="btn btn-sm btn-success" type="submit" >Save &nbsp; <i className="fas fa-check"></i></Button>
                </div>
                )
            
        

        let editForm = (
            <form className="m-2" onSubmit={(e) => { this.handleQuizSettingsFormSubmit(e) }}>
                <FormGroup htmlFor="quiz-title" label="Quiz Title" required>
                    <Input id="quiz-title" type="text" value={this.props.quiz.title} cb={this.props.updateField.bind(this, 'title')} disabled={disabled} required />
                </FormGroup>
                <FormGroup htmlFor="unlock-code" label="Unlock Code (optional)">
                    <Input id="unlock-code" type="text" value={this.props.quiz.unlockCode} cb={this.props.updateField.bind(this, 'unlockCode')} disabled={disabled} />
                </FormGroup>
                {this.props.quiz.id == null ? null : checkBoxes}
                {buttons}
            </form>
        );

        return (
            <Fragment>
                <div onMouseEnter={this.props.onHover} className="quiz-settings">                    
                    <div className="row">
                        <div className="col-6 mx-auto">

                            <OverlayImage cb={this.state.editMode ? this.setModal.bind(this, true) : null}
                                imageSource={this.props.quiz.image.filename ? `/media?filename=${this.props.quiz.image.filename}` : "/images/no-image.png"}
                                enabled={this.state.editMode} containerClass="m-2">
                                <h5 className="text-white text-center pt-3 pb-2 bg-dark-trans w-90">{this.props.quiz.image.filename ? 'Click to change' : 'Click to add'}</h5>
                                </OverlayImage>

                        </div>
                        <div className="col-md-6">
                            {editForm}                             
                        </div>
                    </div>
                </div>

                <SelectMedia
                    type="Image"
                    cb={(imageData) => { this.props.updateField('image', imageData) }}
                    showModal={this.state.showModal}
                    handleHideModal={this.setModal.bind(this, false)}
                />

            </Fragment>
            )
    }
}