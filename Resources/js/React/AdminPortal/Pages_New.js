import React, { Component, Fragment } from 'react';
import { render } from 'react-dom';

import ProgressBar from '../Components/ProgressBar';
import PageDetails from './Pages/PageDetails';
import SelectTemplate from './Pages/SelectTemplate';

import $ from 'jquery';

const baseUri = "/admin/web/pages/new";

export default class NewPageWrapper extends Component {
    constructor(props) {
        super(props);

        this.state = {
            stage: 1,
            page: null,
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
                <PageDetails pageData={this.state.page}
                    cb={(data) => {
                        this.setState({
                            stage: 2,
                            page: data
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
            <Fragment>
                <ProgressBar progress={this.state.stage * 50} color="info"/>
                {DivBlock}
            </Fragment>
        );
    }
}

if (document.getElementById('react_PagesNew'))
    render(<NewPageWrapper />, document.getElementById('react_PagesNew'));