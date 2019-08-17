import React, { Component, Fragment } from 'react';
import TextBlockLink from './Link';
import { Input, TextArea } from '../Components/FormControl';
import { Button, ConfirmButton } from '../Components/Button';
import _ from 'lodash';
import $ from 'jQuery';

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
                heading: null,
                text: null,
                link: {
                    align: null,
                    href: null,
                    isButton: false,
                    text: null
                }
            },
            editMode: Mode.View,
            requestPending: false
        }
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.content && nextProps.content != this.state.content) {
            this.setState({
                content: _.cloneDeep(nextProps.content)
            });
        }
    }

    editVal(field, value) {
        let content = _.cloneDeep(this.state.content);
        switch (field) {
            case "heading":
                content.heading = value;
                break;

            case "text":
                content.text = value;
                break

            case "link":
                content.link = value;
        }

        this.setState({
            content: content
        });
    }

    cancelEditMode() {
        this.setState({
            editMode: Mode.View,
            content: this.props.content
        });
    }

    editMode(t) {
        this.setState({
            editMode: t
        });
    }

    saveChanges() {
        console.log(this.state.content.heading);
        this.setState({
            requestPending: true,
            editMode: Mode.Preview
        }, () => {
            $.ajax({
                type: 'post',
                url: `${this.props.baseUri}/${this.props.content.pageId}/text/${this.props.content.slotNo}`,
                data: {
                    heading: this.state.content.heading,
                    text: this.state.content.text,
                    link: this.state.content.link
                },
            }).done(() => {
                this.props.u();

                this.setState({
                    editMode: Mode.View,
                    requestPending: false
                });                
            }).fail((err) => {
                console.error(err);
                this.setState({
                    editMode: Mode.Edit,
                    requestPending: false
                });
            });
        });
    }

    render() {
        let btnEditMode;
        if (this.props.admin && this.state.editMode == Mode.View) {
            btnEditMode = (
                <Button btnClass="btn btn-sm btn-info" cb={this.editMode.bind(this, Mode.Edit)}>
                    Edit <i className="fas fa-pencil"></i>
                </Button>
            )
        }

        let btnCenter;
        if (this.state.editMode == Mode.Preview) {
            btnCenter = (
                <Button btnClass="btn btn-info" type="button" cb={this.editMode.bind(this, Mode.Edit)}>
                    Edit <i className="fa fa-pencil"></i>
                </Button>
            )
        } else {
            btnCenter = (
                <Button btnClass="btn btn-info" type="button" cb={this.editMode.bind(this, Mode.Preview)}>
                    Preview <i className="fa fa-binoculars"></i>
                </Button>
            )
        }

        let btnManageChanges;
        if (this.props.admin && this.state.editMode != Mode.View) {
            btnManageChanges = (
                <div role="group" className="btn-group btn-group-sm pb-2 d-block">
                    <ConfirmButton btnClass="btn btn-danger" cb={this.cancelEditMode.bind(this)}>
                        Cancel <i className="fas fa-times"></i>
                    </ConfirmButton>

                    {btnCenter}

                    <ConfirmButton pending={this.state.requestPending} cb={this.saveChanges.bind(this)} btnClass="btn btn-success">
                        Save <i className="fa fa-check"></i>
                    </ConfirmButton>
                </div>
            )
        }

        let text = <p>{this.state.content.text}</p>;
        if (this.state.editMode == Mode.Edit) {
            text = (
                <Fragment>
                    <small clasName="text-muted">Text Content (Required)</small>
                    <TextArea inputClass="form-control cms mb-2" value={this.state.content.text} rows={6} cb={this.editVal.bind(this, 'text')} required></TextArea>
                </Fragment>
            )
        }

        let heading;
        if (!(this.state.editMode == Mode.Edit) && this.state.content.heading) {
            heading = <h6 className="d-inline mr-3">{this.state.content.heading}</h6>
        } else if (this.state.editMode == Mode.Edit) {
            heading = (
                <Fragment>
                    <small className="text-muted">Heading (Optional)</small>
                    <Input type="text" inputClass="form-control cms" value={this.state.content.heading || null} cb={this.editVal.bind(this, 'heading')} />
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