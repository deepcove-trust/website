import React, { Component, Fragment } from 'react';
import { FormGroup, Input, Select, TextArea } from '../../Components/FormControl';
import { PageUrl } from '../../../helpers';
import { Button } from '../../Components/Button';
import $ from 'jquery';

const baseUri = "/api"

export default class PageDetails extends Component {
    constructor(props) {
        super(props);

        if (!document.getElementById('react_PagesNew')) {
            throw `Failed to attach component. Attribute 'data-filter' was not found`;
        }

        this.state = {
            sections: null,
            pageData: this.props.pageData || {
                name: null,
                description: null,
                section: document.getElementById('react_PagesNew').getAttribute("data-filter")
            }
        }
    }

    componentDidMount() {
        $.ajax({
            method: 'get',
            url: `${baseUri}/sections`
        }).done((data) => {
            this.setState({
                sections: data
            });
        }).fail((err) => {
            console.error(`[PageDetails@componentDidMount] Error retrieving Sections: `, err.responseText);
        });
    }

    next(e) {
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
        let url = PageUrl(this.state.pageData.name, this.state.pageData.section);

        return (
            <Fragment>
                <div className="row">
                    <div className="col-12">
                        <h1 className="text-center pb-3">Create a New Page</h1>
                    </div>
                </div>

                <form className="row" onSubmit={this.next.bind(this)}>
                    <div className="col-lg-6 col-sm-12">
                        <FormGroup label="Page Name:" required>
                            <Input type="text"
                                value={this.state.pageData.name}
                                cb={this.updateState.bind(this, 'name')}
                                required
                            />
                        </FormGroup>

                        <FormGroup label="Website Section:" required>
                            <Select options={this.state.sections}
                                selected={this.state.pageData.section}
                                cb={this.updateState.bind(this, 'section')}
                            />
                        </FormGroup>

                        <FormGroup label="Page URL:">
                            <a className="d-block" href={url}>{url}</a>
                        </FormGroup>
                    </div>

                    <div className="col-lg-6 col-sm-12">
                        <FormGroup label="Page Description">
                            <TextArea rows={4}
                                maxLength={150}
                                value={this.state.pageData.description}
                                cb={this.updateState.bind(this, 'description')}
                                placeHolder="This may be displayed in Google Search Results"
                            />
                        </FormGroup>
                    </div>

                    <div className="col-12">
                        <Button btnClass="btn btn-info float-left" disabled>
                            <i className="far fa-arrow-circle-left"></i> Back
                        </Button>

                        <Button btnClass="btn btn-info float-right" type="submit">
                            Next <i className="far fa-arrow-circle-right"></i>
                        </Button>
                    </div>
                </form>
            </Fragment>
        )
    }
}