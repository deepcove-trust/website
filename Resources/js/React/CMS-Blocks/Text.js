import React, { Component, Fragment } from 'react';
import TextBlockLink from './Link';
import { FormGroup, Input, TextArea } from '../Components/FormControl';
import { Button, ConfirmButton } from '../Components/Button';

const Mode = {
    View: 'view',
    Edit: 'edit',
    Preview: 'preview'
}

export default class TextBlock extends Component {
    constructor(props) {
        super(props);

        this.state = {
            content: {
                title: null,
                text: null,
                link: {
                    align: null,
                    href: null,
                    isButton: false,
                    text: null
                }
            },
            editMode: Mode.View
        }
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.content && nextProps.content != this.state.content) {
            this.setState({
                content: nextProps.content
            });
        }
    }

    editMode(t) {
        this.setState({
             editMode: t
         });
    }

    render() {
        let btnEditMode;
        if (this.props.admin && !(this.state.editMode == Mode.Edit)) {
            btnEditMode = (
                <Button btnClass="btn btn-sm btn-info" cb={this.editMode.bind(this, Mode.Edit)}>
                    Edit <i className="fas fa-pencil"></i>
                </Button>
            )
        }

        let btnManageChanges;
        if (this.props.admin && this.state.editMode == Mode.Edit) {
            btnManageChanges = (
                <div role="group" className="btn-group btn-group-sm pb-2 d-block">
                    <ConfirmButton btnClass="btn btn-danger" cb={this.editMode.bind(this, Mode.View)}>
                        Cancel <i className="fas fa-times"></i>
                    </ConfirmButton>

                    <button className="btn btn-info" type="button">
                        Preview <i className="fa fa-binoculars"></i>
                    </button>

                    <button className="btn btn-success" type="button">
                        Save <i className="fa fa-check"></i>
                    </button>
                </div>
            )
        }

        let text = <p>{this.state.content.text}</p>;
        if (this.state.editMode == Mode.Edit) {
            text = (
                <Fragment>
                    <small clasName="text-muted">Text Content (Required)</small>
                    <TextArea inputClass="form-control cms mb-2" value={this.state.content.text} rows={6} required></TextArea>
                </Fragment>
            )
        }

        let heading;
        if (!(this.state.editMode == Mode.Edit )&& this.state.content.heading) {
            heading = <h6 className="d-inline mr-3">{this.state.content.heading}</h6>
        } else if (this.state.editMode == Mode.Edit) {
            heading = (
            <Fragment>
                <small className="text-muted">Heading (Optional)</small>
                <Input type="text" inputClass="form-control cms" value={this.state.content.heading || null} />                
            </Fragment>
            )
        }

        let link;
        if (this.state.content.link) {
            link = <TextBlockLink link={this.state.content.link} />
        }       

        return (
            <Fragment>
                {btnManageChanges}
                {heading}
                {btnEditMode}       
                {text}
                {link}
            </Fragment>
        )
    }
}