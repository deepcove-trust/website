import React, { Component, Fragment } from 'react';
import { render } from 'react-dom';
import PageMeta from './Pages/PageMeta';

import $ from 'jquery';
import Alert from '../Components/Alert';
import ErrorBoundary from '../Errors/ErrorBoundary';

const baseUri = "/admin/pages";

export default class UpdatePageWrapper extends Component {
    constructor(props) {
        super(props);

        this.state = {
            page: null,
            dataPageId: null
        }
    }

    componentDidMount() {
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
        $.ajax({
            method: 'put',
            url: `${baseUri}/${this.state.page.id}`,
            data: e
        }).done((url) => {
            window.location.replace(url);
        }).fail((err) => {
            this.Alert.error(null, err.responseText);
        })
    }

    render() {
        if (!this.state.page) {
            return (
                <div className="text-center mt-5">
                    <i className="far fa-spinner-third fa-spin fa-5x mt-5" />
                </div>
            )
        }

        return (
            <ErrorBoundary customError="react-page-update">
                <Alert onRef={ref => (this.Alert = ref)}>
                    <PageMeta title="Page Settings"
                        data={this.state.page}
                        saveChanges={this.updatePage.bind(this)}
                    />
                </Alert>
            </ErrorBoundary>
        );
    }
}

if (document.getElementById('react_PageUpdate'))
    render(<UpdatePageWrapper />, document.getElementById('react_PageUpdate'));