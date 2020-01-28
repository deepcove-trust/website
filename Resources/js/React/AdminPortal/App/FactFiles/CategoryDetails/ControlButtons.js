import React, { Component } from 'react';
import { Button } from '../../../../Components/Button';

export default class ControlButtons extends Component {
    render() {
        return (
            <div className={`text-center control-buttons ${this.props.show ? "control-buttons-show" : ""}`}>
                <Button className="btn btn-danger" cb={this.props.onDiscard.bind(this)}>Discard Changes</Button>
                <Button className="btn btn-success m-1 mr-3" cb={this.props.onSave.bind(this)}>Save Changes</Button>
            </div>
        )
    }
}