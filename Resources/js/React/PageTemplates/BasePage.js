import React, { Component, Fragment } from 'react';
import { render } from 'react-dom';
import PageControls from './PageControls';
import ReactTemplate1 from './1';
import ReactTemplate2 from './2';
import $ from 'jQuery';

const baseUri = `/api/pages`;
const components = {
    1: ReactTemplate1,
    2: ReactTemplate2
}

export default class BasePage extends Component {

    constructor(props) {
        super(props);

        this.state = {
            pageId: null,
            targetRevision: null,
            allowEdits: false,
            page: null,
            original: null
        };
    }

    componentDidMount() {
        this.setState({
            pageId: document.getElementById('react_template').getAttribute("data-pageid")
        }, () => this.getData());
    }

    getData() {
        $.ajax({
            method: 'get',
            url: `${baseUri}/${this.state.pageId}/revision`
        }).done((data) => {
            this.setState({
                page: data,
                original: data
            });
        }).fail((err) => {
            console.error(`[BasePage@getData] Error getting page ${this.state.pageId} data: `, err.responseText);
        });
    }

    // This method is called when a check box is pushed 
    // while editing a single component
    receiveChanges(type, e) {
        let page = this.state.page;

        if (type == 'text') {
            page.textComponents[e.slotNo] = e;
        } else if(type == 'media') {

        }
        this.setState({
            page: page
        });
    }

    render() {
        // Page is not in state yet
        if (!this.state.page)
            return <div />

        const TemplateName = components[this.state.page.templateId];

        return (
            <Fragment>
                <PageControls allowEdits={this.state.allowEdits}
                    u={this.getData.bind(this)}
                    editMode={(mode) => {
                        this.setState({
                            allowEdits: mode
                        });
                    }}
                />

                <TemplateName data={this.state.page}
                    allowEdits={this.state.allowEdits}
                    u={this.getData.bind(this)}
                    pushChanges={this.receiveChanges.bind(this)}
                />
            </Fragment>
        );
    }

}

if (document.getElementById('react_template'))
    render(<BasePage />, document.getElementById('react_template'));