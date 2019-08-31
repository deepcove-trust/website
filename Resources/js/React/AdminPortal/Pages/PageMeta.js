import React, { Component, Fragment } from 'react';
import { PageDescription, PageName, PreviewUrl, WebsiteSection } from './MetaInputs';
import { Button } from '../../Components/Button';
import $ from 'jquery';

export default class PageMeta extends Component {
    constructor(props) {
        super(props);

        this.state = {
            sections: [],
            pageData: this.props.data || {
                name: "",
                description: "",
                section: ""
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
            }, () => this.getDefaultSection());
        }).fail((err) => {
            console.error(`[PageMeta@componentDidMount] Error retrieving Sections: `, err.responseText);
        });
    }

    getDefaultSection() {
        if (!document.getElementById('react_PageNew'))
            return;
        
        let data = this.state.pageData;
        data.section = document.getElementById('react_PageNew').getAttribute("data-filter")
        this.setState({
            pageData: data
        });
    }

    submitChanges(e) {
        e.preventDefault();
        if (this.props.cb)
            this.props.cb(this.state.pageData);
        else
            this.props.saveChanges(this.state.pageData);
    }

    updateState(field, val) {
        let page = this.state.pageData;
        page[field] = val;

        this.setState({
            pageData: page
        });
    }

    render() {
        let btnText = (
            <Fragment>
                Save Changes <i className="fas fa-check-circle" />
            </Fragment>
        )
        if (!this.props.saveChanges)
            btnText = (
                <Fragment>
                    Select a Template <i className="far fa-arrow-circle-right" />
                </Fragment>
            );
    
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
                        <Button btnClass="btn btn-dark float-right" type="submit" disabled={!!this.state.errorText}>
                            {btnText}
                        </Button>
                    </div>
                </form>
            </section>
        )
    }
}