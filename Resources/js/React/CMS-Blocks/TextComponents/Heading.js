import React, { Component, Fragment } from 'react';
import { FormGroup, Input } from '../../Components/FormControl';
import { Button, BtnGroup } from '../../Components/Button';


export default class Heading extends Component {
    render() {

        return (
            <Fragment>
                <EditButtons edit={this.props.edit}
                    allowEdits={this.props.allowEdits}
                    setEditMode={this.props.setEditMode}
                    settings={this.props.settings}
                    reset={this.props.reset}
                    pushChanges={this.props.pushChanges}
                />

                <HeadingText edit={this.props.edit}
                    heading={this.props.heading}
                    cb={this.props.updateVal}
                />
            </Fragment>
        )
    }
}

export class EditButtons extends Component {
    render() {
        if (!this.props.allowEdits || !this.props.settings)
            return null;

        let btn = !this.props.edit ? (
            <Button className="btn btn-dark btn-sm d-block ml-auto mr-0" cb={this.props.setEditMode.bind(this, true)}>
                Edit Section &nbsp; <i className="fa fa-pencil" />
            </Button>
        ) : (
            <BtnGroup className="d-block text-right">
                <Button className="btn btn-dark btn-sm" cb={this.props.reset}>
                    Undo <i className="fas fa-undo" />
                </Button>

                <Button className="btn btn-info border-dark btn-sm" cb={this.props.pushChanges}>
                    <i className="fas fa-check" />
                </Button>
            </BtnGroup>
        )
        
        return (
            <Fragment>
                {btn}
                <hr />
            </Fragment>
        )
    }
}

class HeadingText extends Component {
    render() {
        if (!this.props.edit)
            return (
                <h4>{this.props.heading}</h4>
            )

        return (
            <FormGroup label="Heading: ">
                <Input type="text" value={this.props.heading} cb={this.props.cb}/>
            </FormGroup>
        )
    }
}