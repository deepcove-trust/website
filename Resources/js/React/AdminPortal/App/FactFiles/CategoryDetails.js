import React, { Component, Fragment } from 'react';
import $ from 'jquery';
import _ from 'lodash';

import Alert from '../../../Components/Alert';
import { FormGroup, Input, TextArea, Select } from '../../../Components/FormControl';
import EntryImages from './CategoryDetails/EntryImages';
import EntryList from './CategoryDetails/EntryList';
import EntryAudio from './CategoryDetails/EntryAudio';
import EntryNuggets from './CategoryDetails/EntryNuggets';
import ControlButtons from './CategoryDetails/ControlButtons';

const url = '/admin/app/factfiles';

export default class CategoryDetails extends Component {
    constructor(props) {
        super(props);

        this.state = {
            category: {
                selectedEntryId: 0,
                entries: [],
                name: 'Loading',
                id: null
            }
        }
    }

    componentDidMount() {
        this.getData();
    }

    getData() {
        console.log('Getting category list');
        $.ajax({
            type: 'get',
            url: `${url}/categories/${this.props.categoryId}`,
        }).done((data) => {
            this.setState({
                category: data
            });
        }).fail((err) => {
            this.Alert.error(null, err.responseText);
        });
    }

    onEntrySelect(selectedEntryId) {
        this.setState({
            selectedEntryId
        });
    }

    render() {

        return (
            <Alert onRef={ref => (this.Alert = ref)}>
                <h5 className="p-link mt-3" onClick={this.props.onBack.bind(this)}>Back to categories</h5>
                <div className="row">

                    {
                        // Left hand side of display - list of entries
                    }
                    <div className="px-0 col-lg-8">
                        <EntryList
                            categoryName={this.state.category ? this.state.category.name : "Loading"}
                            selectedEntryId={this.state.selectedEntryId}
                            entries={this.state.category ? this.state.category.entries : null}
                            onSelect={this.onEntrySelect.bind(this)}
                        />

                        <div className="bg-trans">
                            <EntryDetails entryId={this.state.selectedEntryId || 0} />
                        </div>

                    </div>

                    {
                        // Right hand side of display - entry details
                    }
                    <div className="col-lg-4 py-1 bg-dark">
                        <h5 className="center-text text-white">Preview</h5>
                    </div>

                </div>
            </Alert>
        )
    }
}

class EntryDetails extends Component {

    constructor(props) {
        super(props);

        this.state = {
            hasChanged: false,
            entry: {
                id: 0,
                primaryName: "",
                altName: "",
                images: [],
                mainImageId: 0,
                listenAudio: {
                    id: 0,
                    name: ""
                },
                pronounceAudio: {
                    id: 0,
                    name: ""
                },
                bodyText: "",
                nuggets: []
            }
        }
    }

    componentDidMount() {
        this.getData(this.props.entryId);
    }

    componentDidUpdate(prevProps) {
        if (prevProps != this.props) {
            this.getData();
        }
    }

    getData() {
        console.log('Getting data');
        if (this.props.entryId != 0) {
            $.ajax({
                type: 'get',
                url: `${url}/entries/${this.props.entryId}`
            })
                .done((data) => {
                    this.setState({
                        hasChanged: false,
                        entry: data,
                    })
                })
                .fail((err) => {
                    this.Alert.error(null, err.responseText);
                });
        }
    }

    updateField(key, val) {
        let entry = this.state.entry;
        entry[key] = val;
        this.setState({
            hasChanged: true,
            entry
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
        $.ajax({
            type: 'put',
            url: `${url}/entries/${this.props.entryId}`,
            data: {
                primaryName: entry.primaryName,
                altName: entry.altName,
                bodyText: entry.bodyText,
                mainImageId: entry.mainImageId,
                listenAudioId: entry.listenAudio.id,
                pronounceAudioId: entry.pronounceAudio.id,
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
            .done(() => {
                this.Alert.success('Entry updated!');
                this.getData()
            })
            .fail(err => {
                this.Alert.error(null, err.responseText);
                this.getData();
            });
    }

    render() {

        if (!this.props.entryId) return <div></div>

        return (
            <Alert onRef={ref => (this.Alert = ref)}>
                <form className="p-3">
                    <FormGroup label="Primary Name" htmlFor="primaryName" tooltip="This name will appear ..." required>
                        <Input type="text" id="primaryName" name="primaryName" value={this.state.entry.primaryName} cb={this.updateField.bind(this, 'primaryName')} placeHolder="Enter primary name here..." required />
                    </FormGroup>

                    <FormGroup label="Alternate Name" htmlFor="altName">
                        <Input type="text" id="altName" name="altName" value={this.state.entry.altName} cb={this.updateField.bind(this, 'altName')} />
                    </FormGroup>

                    <FormGroup label="Main content" htmlFor="bodyText" required>
                        <TextArea id="bodyText" name="bodyText" value={this.state.entry.bodyText} placeHolder="Enter text here..." cb={this.updateField.bind(this, 'bodyText')} required />
                    </FormGroup>

                    <EntryImages images={this.state.entry.images} mainImageId={this.state.entry.mainImageId} />

                    <EntryAudio audioFile={this.state.entry.listenAudio} pronounceFile={this.state.entry.pronounceAudio} />

                    <EntryNuggets nuggets={this.state.entry.nuggets} onUpdate={this.updateNugget.bind(this)}
                        onAdd={this.addNewNugget.bind(this)} onDelete={this.deleteNugget.bind(this)} onShift={this.shiftNugget.bind(this)} />                    

                    <ControlButtons onSave={this.onSave.bind(this)} onDiscard={this.getData.bind(this)} show={this.state.hasChanged} />
                </form>
            </Alert>
        )
    }

}