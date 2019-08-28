import React, { Component, Fragment } from 'react';
import TextBlockAction from './Text/TextBlockAction';
import EditButton from './Text/EditButtons'
import Heading from './Text/Heading';
import Content from './Text/Content';
import $ from 'jQuery';
import _ from 'lodash';


export const Mode = {
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

    editVal(field, val) {
        let content = _.cloneDeep(this.state.content);
        content[field] = val;
        
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

                <Heading mode={this.state.editMode}
                    heading={this.state.content.heading}
                    exists={!!this.state.content.text}
                    editVal={this.editVal.bind(this, 'heading')}
                    editMode={this.editMode.bind(this)}
                    admin={this.props.admin}
                />

                <Content mode={this.state.editMode}
                    text={this.state.content.text}
                    editVal={this.editVal.bind(this)}
                />

                <TextBlockAction mode={this.state.editMode}
                    slotNo={this.state.content.slotNo}
                    link={this.state.content.link}
                    showEditButton={this.state.editMode == Mode.Edit}
                    settings={this.props.settings}
                    editVal={this.editVal.bind(this)}
                />
            </Fragment>
        )
    }
}