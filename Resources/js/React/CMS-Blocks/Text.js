import React, { Component, Fragment } from 'react';
import TextBlockAction from './TextBlockAction';
import EditButton from './Text/EditButtons'
import { Input, TextArea } from '../Components/FormControl';
import { Button, ConfirmButton } from '../Components/Button';
import _ from 'lodash';
import $ from 'jQuery';
import EditActionModal from './TextBlockAction/EditActionModal';

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
                link: null
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
        if (this.state.editMode == Mode.View) {
            btnEditMode = (
                <Button btnClass="btn btn-sm btn-info" cb={this.editMode.bind(this, Mode.Edit)}>
                    {!this.state.content.heading && !this.state.content.text ? "Add Content" : "Edit"} &nbsp;
                    <i className={!this.state.content.heading && !this.state.content.text ? 'fas fa-plus' : 'fas fa-pencil'}></i>
                </Button>
            )
        }

        let text = <p>{this.state.content.text}</p>;
        if (this.state.editMode == Mode.Edit) {
            text = (
                <Fragment>
                    <small className="text-muted">Text Content</small>
                    <TextArea inputClass="form-control cms mb-2" value={this.state.content.text} rows={6} cb={this.editVal.bind(this, 'text')}></TextArea>
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
            link = (
                <div >
                    <TextBlockAction link={this.state.content.link} />
                    {editLinkBtn}
                </div>
            )
        }

        let editButton;
        if (this.props.admin) {
            editButton = (
                <EditButton mode={this.state.editMode}
                    editMode={this.editMode.bind(this)}
                    saveChanges={this.saveChanges.bind(this)}
                    cancelEditMode={this.cancelEditMode.bind(this)}
                    requestPending={this.state.requestPending}
                />
            )
        }

        return (
            <Fragment>
                {editButton}

                {heading}
                {btnEditMode}
                {text}
                {link}
            </Fragment>
        )
    }
}