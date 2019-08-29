import React, { Component, Fragment } from 'react';
import { render } from 'react-dom';

import ProgressBar from '../Components/ProgressBar';
import PageDetails from './Pages/PageDetails';
import SelectTemplate from './Pages/SelectTemplate';

import $ from 'jquery';

const baseUri = "/admin/web/pages/new";

export default class UpdatePageWrapper extends Component {
    constructor(props) {
        super(props);

        this.state = {
            stage: -1,
            page: null,
            dataPageId: null
        }
    }

    componentDidMount() {
        window.onbeforeunload = () => true;

        if (document.getElementById('react_PageUpdate')) {
            this.setState({
                dataPageId: document.getElementById('react_PageUpdate').getAttribute("data-pageid") 
            })
        }
    }

    updatePage() {
        //This method needs to update the meta
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
                <ProgressBar progress={this.state.stage * 50} color="info" />
                {DivBlock}
            </Fragment>
        );
    }
}

if (document.getElementById('react_PageUpdate'))
    render(<UpdatePageWrapper />, document.getElementById('react_PageUpdate'));