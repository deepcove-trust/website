import React, { Component, Fragment } from 'react';
import { render } from 'react-dom';

import ProgressBar from '../Components/ProgressBar';
import PageMeta from './Pages/PageMeta';
import SelectTemplate from './Pages/SelectTemplate';

import $ from 'jquery';
import ErrorBoundary from '../Errors/ErrorBoundary';

const baseUri = "/admin/pages/create";

export default class NewPageWrapper extends Component {
    constructor(props) {
        super(props);

        this.state = {
            stage: 1,
            page: null,
            dataFilter: null
        }
    }

    componentDidMount() {
        window.onbeforeunload = () => true;
    }

    createPage(template) {
        
        $.ajax({
            method: 'post',
            url: `${baseUri}`,
            data: {
                name: this.state.page.name,
                description: this.state.page.description,
                section: this.state.page.section,
                templateId: template.id
            }
        }).done((url) => {
            window.onbeforeunload = null;
            window.location.replace(url);
        }).fail((err) => {
            console.error(`[PageNew@createPage] Error getting data: `, err.responseText);
        })
    }

    render() {
        let DivBlock;
        if (this.state.stage == 1)
            DivBlock = (
                <PageMeta title="Create a new Page"
                    data={this.state.page}
                    cb={(pageResponse) => {
                        this.setState({
                            stage: 2,
                            page: pageResponse
                        });
                    }}
                />
            );
        else if (this.state.stage == 2)
            DivBlock = (
                <SelectTemplate
                    cb={this.createPage.bind(this)}
                    goBack={(stage) => {
                        this.setState({
                            stage: stage
                        });
                    }}
                />
            );

        return (
            <ErrorBoundary customError="react-page-new">
                <ProgressBar progress={this.state.stage * 50} color="info"/>
                {DivBlock}
            </ErrorBoundary>
        );
    }
}

if (document.getElementById('react_PageNew'))
    render(<NewPageWrapper />, document.getElementById('react_PageNew'));