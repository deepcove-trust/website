import React, { Component } from 'react';
import { Button } from '../../Components/Button';

const Mode = {
    view: 'view',
    edit: 'edit'
}

export default class EditButtons extends Component {
    render() {
        return this.props.mode == Mode.view ? (
            <Button className="btn btn-info btn-sm" cb={this.props.setModeCb.bind(this, Mode.edit)}>
                Edit <i className="fas fa-pencil" />
            </Button>
        ) : (
            <div role="group" className="btn-group btn-group-sm">
                <Button className="btn btn-danger" cb={this.props.cancelCb}>
                    Cancel <i className="fas fa-times" />
                </Button>

                <Button className="btn btn-success" cb={this.props.saveChangesCb} pending={this.props.pending}>
                    Save <i className="fas fa-check" />
                </Button>
            </div>        
        );
    }
}