﻿import React, { Component } from 'react';
import TextControls from './TextComponents/Controls';
import Content from './TextComponents/Content';
import CmsButton from './TextComponents/CmsButton';

import _ from 'lodash';

export default class TextBlock extends Component {
    constructor(props) {
        super(props);

        this.state = {
            content: _.cloneDeep(this.props.content) || {
                text: "",
                button: {}
            },
            edit: false 
        }
    }

    componentWillReceiveProps(nextProps) {
        if (!nextProps.allowEdits) {
            this.setState({
                edit: false
            });
        }
    }

    pushChanges() {
        this.setState({
            edit: false
        }, () => {
            this.props.pushChanges(this.state.content);
        })        
    }

    updateVal(field, val) {
        let content = this.state.content;
        content[field] = val;
        this.setState({
            content: content
        });
    }

    render() {
        return (
            <div className="cms-text">
                <TextControls allowEdits={this.props.allowEdits}
                    edit={this.state.edit}
                    updateVal={this.updateVal.bind(this, 'heading')}
                    settings={!!this.props.settings}
                    setEditMode={(x) => {
                        this.setState({
                            edit: x
                        });
                    }}
                    reset={() => {
                        this.setState({
                            edit: false,
                            content: _.cloneDeep(this.props.content)
                        })
                    }}
                    pushChanges={this.pushChanges.bind(this)}
                />

                <Content id={this.state.content.id}
                    edit={this.state.edit}
                    content={this.state.content.text}
                    updateVal={this.updateVal.bind(this, 'text')}
                />

                <CmsButton edit={this.state.edit}
                    id={this.state.content.id}
                    button={this.state.content.button}
                    settings={this.props.settings}
                    onSave={this.updateVal.bind(this)}
                    onDelete={this.updateVal.bind(this, 'button', null)}
                />
            </div>
        )
    }
}