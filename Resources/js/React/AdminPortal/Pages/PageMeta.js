import React, { Component } from 'react';
import { PageDescription, PageName, PreviewUrl, WebsiteSection } from './PageMeta/MetaInputs';
import { Button } from '../../Components/Button';
import $ from 'jquery';

export default class PageMeta extends Component {
    constructor(props) {
        super(props);

        let section;
        if (document.getElementById('react_PageNew')) {
            section: document.getElementById('react_PageNew').getAttribute("data-filter")
        }

        this.state = {
            sections: [],
            pageData: this.props.data || {
                name: "",
                description: "",
                section: section || ""
            },
            errorText: "" 
        }
    }

    componentDidMount() {
        $.ajax({
            method: 'get',
            url: `/api/sections`
        }).done((data) => {
            this.setState({
                sections: data
            });
        }).fail((err) => {
            console.error(`[PageMeta@componentDidMount] Error retrieving Sections: `, err.responseText);
        });
    }

    submitChanges(e) {
        e.preventDefault();
        this.props.cb(this.state.pageData);
    }

    updateState(field, val) {
        let page = this.state.pageData;
        page[field] = val;

        this.setState({
            pageData: page
        });
    }

    render() {
        return (
            <section className="fade1sec">
                <div className="row">
                    <div className="col-12">
                        <h1 className="text-center pb-3">{this.props.title}</h1>
                    </div>
                </div>

                <form className="row" onSubmit={this.submitChanges.bind(this)}>
                    <div className="col-lg-6 col-sm-12">
                        <PageName value={this.state.pageData.name}
                            errorText={this.state.errorText}
                            cb={this.updateState.bind(this, 'name')}
                            validationCb={(e) => {
                                this.setState({
                                    errorText: e
                                });
                            }}
                        />

                        <WebsiteSection value={this.state.pageData.section}
                            options={this.state.sections}
                            cb={this.updateState.bind(this, 'section')}
                        />

                        <PreviewUrl page={this.state.pageData} />
                    </div>

                    <div className="col-lg-6 col-sm-12">
                        <PageDescription value={this.state.pageData.description}
                            cb={this.updateState.bind(this, 'description')}
                        />
                    </div>

                    <div className="col-12">
                        <Button btnClass="btn btn-info float-right" type="submit" disabled={!!this.state.errorText}>
                            Select a Template <i className="far fa-arrow-circle-right"></i>
                        </Button>
                    </div>
                </form>
            </section>
        )
    }
}