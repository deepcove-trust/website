import { Mode } from '../Text';
import React, { Component, Fragment } from 'react';
import { TextArea } from '../../Components/FormControl';

export default class Content extends Component {

    render() {

        let text = <p>{this.props.text}</p>;
        if (this.props.mode == Mode.Edit) {
            text = (
                <Fragment>
                    <small className="text-muted">Text Content</small>
                    <TextArea inputClass="form-control cms mb-2" value={this.props.text} rows={6} cb={this.props.editVal.bind(this, 'text')}></TextArea>
                </Fragment>
            )
        }

        return (
            <Fragment>
                {text}
            </Fragment>
        );

    }

}