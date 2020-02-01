import React, { Component, Fragment } from 'react';
import $ from 'jquery';
import _ from 'lodash';

import { FormGroup, Input, TextArea, Checkbox } from '../../../Components/FormControl';
import EntryImages from './CategoryDetails/EntryImages';
import EntryList from './CategoryDetails/EntryList';
import EntryAudio from './CategoryDetails/EntryAudio';
import EntryNuggets from './CategoryDetails/EntryNuggets';
import ControlButtons from './CategoryDetails/ControlButtons';
import { ConfirmButton, ConfirmModal } from '../../../Components/Button';
import PhonePreview from '../../../Components/PhonePreview';
import FactFilePreview from './FactFilePreview';

const url = '/admin/app/factfiles';

export default class CategoryDetails extends Component {
    constructor(props) {
        super(props);

        this.state = {
            selectedEntryId: 0,
            addEntryMode: false,
            category: {
                addEntryMode: false,
                entries: [],
                name: 'Loading',
                id: null
            },
            previewEntry: null
        }
    }

    componentDidMount() {
        this.getData();
    }

    getData(setSelection) {
        $.ajax({
            type: 'get',
            url: `${url}/categories/${this.props.categoryId}`,
        }).done((data) => {
            this.setState({
                category: data,
                selectedEntryId: setSelection != null ? setSelection : this.state.selectedEntryId,
                addEntryMode: false
            });
        }).fail((err) => {
            this.props.alert.error(null, err.responseText);
        });
    }

    onEntrySelect(selectedEntryId) {
        this.setState({
            selectedEntryId
        });
    }

    onAddEntry() {
        this.setState({
            selectedEntryId: 0,
            addEntryMode: true
        })
    }

    onNameEdit(newName) {
        $.ajax({
            type: 'patch',
            url: `${url}/categories/${this.props.categoryId}`,
            data: {
                name: newName
            }
        }).done(() => {
            this.props.alert.success("Category updated!")
        }).fail((err) => {
            this.props.alert.error(null, err.responseText)
        })

    }

    onDeleteCategory(categoryId) {
        $.ajax({
            type: 'delete',
            url: `${url}/categories/${categoryId}`
        }).done(() => {
            this.props.clearSelection();
            this.props.alert.success("Category deleted!");
        }).fail((err) => {
            this.props.alert.error(null, err.responseText)
        });
    }

    onUpdatePreview(previewEntry) {
        this.setState({
            previewEntry
        });
    }

    clearPreviewEntry() {
        this.setState({
            previewEntry: null,
            selectedEntryId: 0
        })
    }

    render() {

        return (
            <Fragment>
                <h5 className="p-link mt-3" onClick={this.props.clearSelection.bind(this)}>Back to categories</h5>
                <div className="row">

                    {
                        // Left hand side of display - list of entries
                    }
                    <div className="px-0 col-lg-7">
                        <EntryList
                            categoryName={this.state.category ? this.state.category.name : "Loading"}
                            selectedEntryId={this.state.selectedEntryId}
                            entries={this.state.category ? this.state.category.entries : null}
                            onSelect={this.onEntrySelect.bind(this)}
                            onNameEdit={this.onNameEdit.bind(this)}
                            onDeleteCategory={this.state.category ? this.onDeleteCategory.bind(this, this.state.category.id) : () => { }}
                            onAddEntry={this.onAddEntry.bind(this)}
                            addEntryMode={this.state.addEntryMode}
                        />

                        <div className="bg-trans">
                            <EntryDetails alert={this.props.alert}
                                onUpdatePreview={this.onUpdatePreview.bind(this)}
                                onSave={this.getData.bind(this)}
                                categoryId={this.state.category.id}
                                entryId={this.state.selectedEntryId}
                                addEntryMode={this.state.addEntryMode}
                                previewEntry={this.state.previewEntry}
                            />
                        </div>

                    </div>

                    {
                        // Right hand side of display - entry details
                    }
                    <div className="col-lg-5 py-1">
                        <div className="m-3 sticky-preview">
                            <PhonePreview>
                                <FactFilePreview previewEntry={this.state.previewEntry} entries={this.state.category.entries} onEntrySelect={this.onEntrySelect.bind(this)} onBack={this.clearPreviewEntry.bind(this)}/>
                            </PhonePreview>
                        </div>
                    </div>

                </div>
            </Fragment>
        )
    }
}

class EntryDetails extends Component {

    emptyEntry = () => ({
        active: false,
        id: 0,
        primaryName: "",
        altName: "",
        images: [],
        mainImageId: 0,
        listenAudio: null,
        pronounceAudio: null,
        bodyText: "",
        nuggets: []
    });

    constructor(props) {
        super(props);
        console.log('constructor')
        this.state = {
            hasChanged: this.props.addEntryMode,
            entry: this.props.previewEntry || this.emptyEntry()
        }
    }

    componentDidMount() {
        this.getData(this.props.entryId);
    }

    componentDidUpdate(prevProps) {        
        if (prevProps != this.props && (this.props.previewEntry == null || this.props.entryId != prevProps.entryId)) {
            this.getData();
            if (this.props.addEntryMode) {
                this.setState({
                    hasChanged: true
                })
            }
            if (this.props.addEntryMode != prevProps.addEntryMode) {                
                this.setState({
                    entry: this.emptyEntry()
                })
            }
        }
    }

    getData() {
        if (this.props.entryId != 0) {
            $.ajax({
                type: 'get',
                url: `${url}/entries/${this.props.entryId}`
            })
                .done((data) => {
                    this.setState({
                        hasChanged: false,
                        entry: data,
                    }, () => {
                        this.props.onUpdatePreview(this.state.entry);
                    })
                })
                .fail((err) => {
                    //this.props.alert.error(null, err.responseText);
                });
        }
        else {
            this.setState({
                hasChanged: false
            })
        }
    }

    updateField(key, val) {
        console.log(key);
        console.log(val);
        let entry = this.state.entry;
        entry[key] = val;
        this.setState({
            hasChanged: true,
            entry
        }, () => {
            this.props.onUpdatePreview(this.state.entry);
        });
        
    }

    updateNugget(index, key, val) {
        let nuggets = this.state.entry.nuggets;
        nuggets[index][key] = val;
        this.updateField("nuggets", nuggets);
    }

    deleteNugget(index) {
        let nuggets = this.state.entry.nuggets;
        nuggets.splice(index, 1);
        this.updateField("nuggets", nuggets);
    }

    shiftNugget(index, direction) {
        let nuggets = this.state.entry.nuggets;

        if (index == 0 && direction == 'down' || index == nuggets.length - 1 && direction == 'up' || nuggets.length == 1) return;
        let swapIndex = direction == 'up' ? index + 1 : index - 1;

        // The array connundrum. Why do the two console logs below not reflect the swapping of the array elements, even though the swap does work?

        console.log(nuggets);

        [nuggets[index], nuggets[swapIndex]] = [nuggets[swapIndex], nuggets[index]];

        console.log(nuggets)

        this.updateField("nuggets", nuggets);
    }

    addNewNugget(newNugget) {
        let nuggets = this.state.entry.nuggets;
        nuggets.push(newNugget);
        this.setState({
            hasChanged: true,
            nuggets
        });
    }

    onSave() {
        let entry = this.state.entry;

        // Crude validation - should replace this with proper validation, ideally
        if (!entry.primaryName || !entry.bodyText || entry.images.length == 0) {
            return this.props.alert.error("Please ensure that you have added a primary name, body text and at least one image before saving");
        }

        $.ajax({
            type: this.props.addEntryMode ? 'post' : 'put',
            url: `${url}/entries/${this.props.addEntryMode ? this.props.categoryId : this.props.entryId}`,
            data: {
                active: entry.active,
                primaryName: entry.primaryName,
                altName: entry.altName,
                bodyText: entry.bodyText,
                mainImageId: entry.mainImageId,
                listenAudioId: entry.listenAudio ? entry.listenAudio.id : null,
                pronounceAudioId: entry.pronounceAudio ? entry.pronounceAudio.id : null,
                images: JSON.stringify(entry.images.map(image => image.id)),
                nuggets: JSON.stringify(entry.nuggets.map((nugget, index) => ({
                    id: 0,
                    imageId: nugget.image.id,
                    factFileEntryId: entry.id,
                    order_index: nugget.orderIndex,
                    name: nugget.name,
                    text: nugget.text
                })))
            }
        })
            .done((data) => {
                this.props.alert.success('Entry updated!');
                this.props.onSave(this.props.addEntryMode ? data : null);
                this.getData()
            })
            .fail(err => {
                this.props.alert.error(null, err.responseText);
                this.getData();
            });
    }

    onRemoveImage(imageId) {
        if (imageId == this.state.entry.mainImageId)
            return this.Alert.error("Unable to delete main image. Set a different image as main and try again.");

        let images = this.state.entry.images;
        let imageToRemove = images.find(image => image.id == imageId);
        images.splice(images.indexOf(imageToRemove), 1);

        this.updateField("images", images);
    }

    onAddImage(data) {
        let newImage = {
            id: data.id,
            filename: data.filename,
            name: data.name,
            isSquare: data.dimensions.height == data.dimensions.width
        }

        let images = this.state.entry.images;
        images.push(newImage);

        this.updateField("images", images);

        if (images.length == 1) this.updateField("mainImageId", newImage.id);
    }

    onAddAudio(audioData, audioSlot) {
        let newAudio = {
            id: audioData.id,
            name: audioData.name,
            filename: audioData.filename,
            mediaType: audioData.mediaType
        };

        this.updateField(audioSlot, newAudio);
    }

    onRemoveAudio(audioSlot) {
        this.updateField(audioSlot, null);
    }

    toggleEntry() {
        $.ajax({
            type: 'patch',
            url: `${url}/entries/toggle/${this.props.entryId}`
        }).done(() => {
            this.props.alert.success("Entry updated!");
            this.props.onSave();
        }).fail((err) => {
            this.props.alert.error(null, err.responseText);
        })
    }

    deleteEntry() {
        $.ajax({
            type: 'delete',
            url: `${url}/entries/${this.props.entryId}`
        }).done(() => {
            this.props.alert.success("Entry deleted");
            this.props.onUpdatePreview(null);            
            this.props.onSave(0);
        }).fail((err) => {
            this.props.alert.error(null, err.responseText);
        })
    }

    render() {

        if (!this.props.entryId && !this.props.addEntryMode) return <div></div>

        let disableControls = this.state.entry.id == 0 ? null : (
            <Fragment>
                <p className={`text-center font-weight-bold d-block ${this.state.entry.active ? "text-success" : "text-danger"}`}>{`This entry is ${this.state.entry.active ? "enabled. It will appear in the app." : "disabled. It will not appear in the app."}`}</p>

                <div className="text-center mb-3">
                    <ConfirmButton className="btn btn-dark" cb={this.toggleEntry.bind(this)}>{this.state.entry.active ? "Disable" : "Enable"}</ConfirmButton>
                    <ConfirmModal question="Delete this entry permanently" confirmPhrase={this.state.entry.primaryName} className="btn btn-danger ml-2" cb={this.deleteEntry.bind(this)}>Delete</ConfirmModal>
                </div>
            </Fragment>
            )

        return (
            <form className="p-3">

                {disableControls}

                <FormGroup label="Primary Name" htmlFor="primaryName" required>
                    <Input type="text" id="primaryName" name="primaryName" value={this.state.entry.primaryName} cb={this.updateField.bind(this, 'primaryName')} placeHolder="Enter primary name here..." required />
                </FormGroup>

                <FormGroup label="Alternate Name" htmlFor="altName">
                    <Input type="text" id="altName" name="altName" value={this.state.entry.altName} cb={this.updateField.bind(this, 'altName')} />
                </FormGroup>

                <FormGroup label="Main content" htmlFor="bodyText" required>
                    <TextArea id="bodyText" name="bodyText" value={this.state.entry.bodyText} placeHolder="Enter text here..." cb={this.updateField.bind(this, 'bodyText')} required />
                </FormGroup>

                <EntryImages images={this.state.entry.images}
                    showWarning={this.state.entry.images.some(image => !image.isSquare)}
                    mainImageId={this.state.entry.mainImageId}
                    onSetMain={(mainImageId) => this.updateField("mainImageId", mainImageId)}
                    onRemove={this.onRemoveImage.bind(this)}
                    onAdd={this.onAddImage.bind(this)}
                />

                <EntryAudio onRemove={this.onRemoveAudio.bind(this)}
                    onAdd={this.onAddAudio.bind(this)}
                    onRemove={this.onRemoveAudio.bind(this)}
                    listenFile={this.state.entry.listenAudio}
                    pronounceFile={this.state.entry.pronounceAudio}
                />

                <EntryNuggets nuggets={this.state.entry.nuggets} onUpdate={this.updateNugget.bind(this)}
                    onAdd={this.addNewNugget.bind(this)} onDelete={this.deleteNugget.bind(this)} onShift={this.shiftNugget.bind(this)} />

                <ControlButtons onSave={this.onSave.bind(this)} onDiscard={this.getData.bind(this)} show={this.state.hasChanged} addEntryMode={this.props.addEntryMode} />
            </form>
        )
    }

}