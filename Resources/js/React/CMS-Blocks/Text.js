import React, { Component, Fragment } from 'react';
import Heading from './TextComponents/Heading';
import TextContent from './TextComponents/TextContent';
//Text Section Component
//Edit/Pencil Button?
import _ from 'lodash';

export default class TextBlock extends Component {
    constructor(props) {
        super(props);

        this.state = {
            content: _.cloneDeep(this.props.content) || {
                heading: "",
                text: "",
                link: {}
            },
            edit: false 
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
            <Fragment>
                <Heading allowEdits={this.props.allowEdits}
                    edit={this.state.edit}
                    heading={this.state.content.heading}
                    updateVal={this.updateVal.bind(this, 'heading')}
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

                <TextContent id={this.state.content.id}
                    edit={this.state.edit}
                    content={this.state.content.text}
                    updateVal={this.updateVal.bind(this, 'text')}
                />

                {/* CmsBTN */}
            </Fragment>
        )
    }
}