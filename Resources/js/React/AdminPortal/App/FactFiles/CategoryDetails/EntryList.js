import React, { Component, Fragment } from 'react';
import { Input, Select } from '../../../../Components/FormControl';
import { Button, ConfirmModal } from '../../../../Components/Button';
import Card, { CardHighlight } from '../../../../Components/Card';

export default class EntryList extends Component {

    constructor(props) {
        super(props);

        this.state = {
            editMode: false,
            categoryName: this.props.categoryName
        }
    }

    componentWillReceiveProps(newProps) {
        if (newProps != this.props) {
            this.setState({
                categoryName: newProps.categoryName
            })
        }
    }

    updateName(categoryName) {
        this.setState({
            categoryName,
            editMode: true
        })
    }

    saveName() {
        this.props.onNameEdit(this.state.categoryName);
        this.setState({
            editMode: false
        });
    }

    resetName() {
        this.setState({
            editMode: false,
            categoryName: this.props.categoryName
        });
    }

    render() {
        let entries = this.props.entries || [];               

        let entryOptions = entries.map(entry => {
            return (
                <option key={entry.id} value={entry.id}>{entry.primaryName} {entry.active ? "" : "(disabled)"}</option>
            );
        });

        entryOptions.unshift(<option key="0" value="0">-- Select an entry --</option>)

        let categoryName = !this.state.editMode ? (
            <Fragment>
                <h3 className="pt-3 pb-2 mb-0 d-inline-block text-white">{this.state.categoryName}</h3>
                <Button className="btn text-white" cb={() => this.setState({ editMode: true })}><i className="fas fa-edit"></i></Button>
                <ConfirmModal className="btn btn-dark float-right m-2" cb={this.props.onDeleteCategory.bind(this)} confirmPhrase={this.state.categoryName} question="Delete this category and all associated entries">
                    <i className="fas fa-trash"></i>&nbsp; Delete Category
                </ConfirmModal>
            </Fragment>
        )
            : (
                <Fragment>
                    <Input inputClass="form-control d-inline-block m-2 w-50" type="text" value={this.state.categoryName} cb={this.updateName.bind(this)} />
                    <Button className="btn btn-danger" cb={this.resetName.bind(this)}><i className="fas fa-times"></i></Button>
                    <Button className="btn btn-success" cb={this.saveName.bind(this)}><i className="fas fa-check"></i></Button>
                </Fragment>
            )


        let hasNoActiveEntries =  !this.props.entries.some(entry => entry.active);
        let emptyCatWarning = this.state.categoryName != 'Loading' && hasNoActiveEntries ? <p className="text-danger text-center mt-3 mx-2">There are no active entries associated with this category. The category will not appear in the app.</p> : null;

        return (
            <Fragment>
                <Card>
                    <CardHighlight>
                        {categoryName}
                    </CardHighlight>                    

                    <div id="entry-dropdown" className={this.props.addEntryMode ? "d-none" : ""}>

                        {emptyCatWarning}

                        <Select
                            formattedOptions={entryOptions}
                            selected={this.props.selectedEntryId}
                            cb={this.props.onSelect.bind(this)}
                        />

                        <Button className="btn btn-success" cb={this.props.onAddEntry.bind(this)}>Add &nbsp; <i className="fas fa-plus"></i></Button>
                    </div>
                </Card>
                <h2 className={`text-center my-4 ${this.props.addEntryMode ? "" : "d-none"}`}>Add New Entry</h2>
            </Fragment>
        )
    }
}

class EntryCard extends Component {

    render() {

        let active = this.props.selectedEntryId == this.props.entryId;

        return (
            <label className={`d-block list-card m-2 p-2 ${active ? 'active' : ''}`} >
                <input type="radio" name="navitem" onChange={this.props.setActive} disabled={this.props.addingNew} />
                <h5>{this.props.entryName}</h5>
            </label>
        )
    }
}