import React, { Component, Fragment } from 'react';
import { Mode } from '../Text';
import { Button } from '../../Components/Button';
import { Input } from '../../Components/FormControl';

export default class Heading extends Component {

    render() {

        let heading;
        if (!(this.props.mode == Mode.Edit) && this.props.heading) {
            heading = <h6 className="d-inline mr-3">{this.props.heading}</h6>
        } else if (this.props.mode == Mode.Edit) {
            heading = (
                <Fragment>
                    <small className="text-muted">Heading (Optional)</small>
                    <Input type="text" inputClass="form-control cms" value={this.props.heading || null} cb={this.props.editVal.bind(this)} />
                </Fragment>
            )
        }

        let btnEditMode;
        if (this.props.admin && this.props.mode == Mode.View) {
            btnEditMode = (
                <Button btnClass="btn btn-sm btn-info" cb={this.props.editMode.bind(this, Mode.Edit)}>
                    {!this.props.heading && !this.props.exists ? "Add Content" : "Edit"} &nbsp;
                    <i className={!this.props.heading && !this.props.exists ? 'fas fa-plus' : 'fas fa-pencil'}></i>
                </Button>
            )
        }

        return (
            <Fragment>
                {heading}
                {btnEditMode}
            </Fragment>
        )
    }

}