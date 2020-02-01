import React, { Component } from 'react';
import { ConfirmButton } from '../../../../Components/Button';

export default class ControlButtons extends Component {
    render() {
        return (
            <div className={`text-center control-buttons ${this.props.show ? "control-buttons-show" : ""}`}>
                <ConfirmButton className="btn btn-danger" cb={this.props.addEntryMode ? this.props.onCancelNew.bind(this) : this.props.onDiscard.bind(this)}>{this.props.addEntryMode ? "Cancel" : "Discard Changes"}</ConfirmButton>
                <ConfirmButton className="btn btn-success m-1 mr-3" cb={this.props.onSave.bind(this)}>{this.props.addEntryMode ? "Save Entry": "Save Changes"}</ConfirmButton>
            </div>
        )
    }
}