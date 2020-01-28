import React, { Component, Fragment } from 'react';
import $ from 'jquery';

import { FormGroup, Input, TextArea, Select } from '../../../../Components/FormControl';

export default class EntryList extends Component {
    render() {
        let entries = this.props.entries || [];

        let entryOptions = entries.map(entry => {
            return (
                <option key={entry.id} value={entry.id}>{entry.primaryName}</option>
            );
        });

        entryOptions.unshift(<option key="0" value="0">-- Select an entry --</option>)

        let entryCards = entries.map(entry => {
            return (
                <EntryCard key={entry.id}
                    entryId={entry.id}
                    entryName={entry.primaryName}
                    selectedEntryId={this.props.selectedEntryId}
                    setActive={this.props.onSelect.bind(this, entry.id)}
                />
            )
        });

        // Append the button to add a new category
        //entryCards.push(<NewEntryCard key="0" onSave={this.getData.bind(this)} alert={this.Alert} />)

        return (
            <div className="card">
                <h3 className="text-center pt-3 pb-2 mb-0 bground-primary text-white">{this.props.categoryName}</h3>
                <div className="show-small" id="entry-dropdown">
                    <Select
                        formattedOptions={entryOptions}
                        selected={this.props.selectedEntryId}
                        cb={this.props.onSelect.bind(this)}
                    />
                </div>
                <div className="show-large">
                    <div id="entries">
                        {entryCards}
                    </div>
                </div>
            </div>
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

class NewEntryCard extends Component {

    render() {
        <div>New entry card</div>
    }

}