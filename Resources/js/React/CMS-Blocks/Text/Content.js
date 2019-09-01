import { Mode } from '../Text';
import React, { Component, Fragment } from 'react';
import TwoWayBinding from '../../Components/CKEditor';


export default class Content extends Component {

    render() {
        if (this.props.mode == Mode.Edit) {
            return (
                <Fragment>
                    <small className="text-muted">Text Content</small>
                    <TwoWayBinding value={this.props.text} cb={this.props.editVal.bind(this, 'text')} id={this.props.id} />
                </Fragment>
            );
        } else {
            return (
                <div dangerouslySetInnerHTML={{ __html: this.props.text }}></div>
            );
        }
    }
}