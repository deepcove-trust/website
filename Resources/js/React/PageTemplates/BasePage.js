import React, { Component, Fragment } from 'react';
import { render } from 'react-dom';
import PageControls from './PageControls';
import ReactTemplate1 from './1';
import ReactTemplate2 from './2';
import ReactTemplate3 from './3';
import ReactTemplate4 from './4';
import ReactTemplate5 from './5';
import ReactTemplate6 from './6';
import ReactTemplate7 from './7';
import ReactTemplate8 from './8';
import ReactTemplate9 from './9';
import ReactTemplate10 from './10';
import ReactTemplate11 from './11';
import $ from 'jQuery';



const baseUri = `/api/pages`;
const components = {
    1: ReactTemplate1,
    2: ReactTemplate2,
    3: ReactTemplate3,
    4: ReactTemplate4,
    5: ReactTemplate5,
    6: ReactTemplate6,
    7: ReactTemplate7,
    8: ReactTemplate8,
    9: ReactTemplate9,
    10: ReactTemplate10,
    11: ReactTemplate11
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

    publishRevision() {

        var reason = prompt("Please provide a revision message:");

        // If user has clicked 'Ok' and not 'Cancel'
        if (reason) {
            $.ajax({
                method: 'post',
                url: `${baseUri}/${this.state.pageId}/revision`,
                data: {
                    reason: reason,
                    textComponents: JSON.stringify(this.state.page.textComponents),
                    imageComponents: JSON.stringify(this.state.page.mediaComponents),
                }
            }).done(() => {
                this.setState({
                    allowEdits: false
                }, () => this.getData())
                window.onbeforeunload = null;
            }).fail((err) => {
                console.error(`[BasePage@publishRevision] Error posting new revision ${this.state.pageId} data: `, err.responseText);
            })
        }
    }

    // This method is called when a check box is pushed 
    // while editing a single component
    receiveChanges(type, e) {
        let page = this.state.page;
        
        if (type == 'text') {
            page.textComponents[e.slotNo] = e;
        } else if (type == 'media') {
            page.mediaComponents[e.slotNo] = e;
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
                    page={this.state.page}
                    settings={!this.state.page.enums}
                    u={this.getData.bind(this)}
                    editMode={(mode) => {
                        window.onbeforeunload = () => mode;
                        this.setState({
                            allowEdits: mode
                        });
                    }}
                    publish={this.publishRevision.bind(this)}
                    revert={() => {
                        window.onbeforeunload = null;
                        this.setState({
                            page: this.state.original,
                            allowEdits: false
                        });
                    }}
                />

                <TemplateName data={this.state.page}
                    allowEdits={this.state.allowEdits}
                    pushChanges={this.receiveChanges.bind(this)}
                />
            </Fragment>
        );
    }

}

if (document.getElementById('react_template'))
    render(<BasePage />, document.getElementById('react_template'));