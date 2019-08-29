import React, { Component, Fragment } from 'react';
import { render } from 'react-dom';

import ProgressBar from '../Components/ProgressBar';
import PageMeta from './Pages/PageMeta';
import SelectTemplate from './Pages/SelectTemplate';

import $ from 'jquery';

const baseUri = "/admin/web/pages";

export default class UpdatePageWrapper extends Component {
    constructor(props) {
        super(props);

        this.state = {
            stage: 1,
            page: null,
            dataPageId: null
        }
    }

    componentDidMount() {
        window.onbeforeunload = () => true;

        if (!document.getElementById('react_PageUpdate')) {

            throw "Error attaching to the DOM, no data attribute pageId found";
        }

        this.setState({
            dataPageId: document.getElementById('react_PageUpdate').getAttribute("data-pageid")
        }, () => {
            $.ajax({
                method: 'get',
                url: `${baseUri}/${this.state.dataPageId}/data`
            }).done((page) => {
                this.setState({
                    page: page
                });
            }).fail((err) => {
                console.error(`[PageUpdate@componentDidMount] Error retrieving page information: `, err.responseText);
            })
        })
    }

    updatePage(e) {
        console.log(`update page methid in pageupdate.js ${e}`)
        //This method needs to update the meta
    }

    render() {
        if (!this.state.page) {
            return (
                <div className="text-center mt-5">
                    <i className="far fa-spinner-third fa-spin fa-5x mt-5" />
                </div>
            )
        }

        let DivBlock;
        if (this.state.stage == 1)
            DivBlock = (
                <PageMeta title="Update Page Details"
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
                    cb={this.updatePage.bind(this)}
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