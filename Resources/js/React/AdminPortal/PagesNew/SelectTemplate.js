import React, { Component, Fragment } from 'react';
import { Button } from '../../Components/Button';
import Panel from '../../Components/Panel';
import $ from 'jquery';

const baseUri = "/api/page/templates";

export default class SelectTemplate extends Component {
    constructor(props) {
        super(props);

        this.state = {
            templates: null
        }
    }

    componentDidMount() {
        $.ajax({
            method: 'get',
            url: `${baseUri}`
        }).done((data) => {
            this.setState({
                templates: data
            });
        }).fail((err) => {
            console.error(`[Login@attemptLogin] Error attempting login: ${err.ResponseText}`);
        });
    }

    render() {
        let templates;
        if (!!this.state.templates) {
            templates = this.state.templates.map((template) => {
                return (
                    <div className="col-lg-4 col-md-6 col-sm-12 mb-3">
                        <Template template={template} showButton="true" cb={this.props.cb} />
                    </div>
                )
            });
        }

        return (
            <Fragment>
                <div className="row">
                    <div className="col-12">
                        <h1 className="text-center pb-3">Select a Template</h1>
                    </div>

                    {templates}

                    <div className="col-12">
                        <Button btnClass="btn btn-info float-left" cb={this.props.goBack.bind(this, 1)}>
                            <i className="far fa-arrow-circle-left"></i> Back
                        </Button>
                    </div>
                </div>
            </Fragment>
        )
    }
}

export class Template extends Component {
    render() {
        let button; 
        if (this.props.showButton) {
            button = (
                <Button btnClass="btn btn-info d-block mx-auto" cb={this.props.cb.bind(this, this.props.template)}>
                    Use This Template <i className="fas fa-check"></i>
                </Button>
            );
        }

        return (
            <Panel>    
                <div style={{ 'margin': '-1rem -1rem 2rem -1rem' }}>
                    <img src="https://via.placeholder.com/150" style={{ 'width': '100%', 'max-height': '300px' }}/>
                </div>

                <h4 className="text-center pb-2">{this.props.template.name}</h4>

                <div className="row text-center">
                    <div className="col-md-6 col-sm-12 py-3">
                        <p className="font-weight-bold">Text Fields</p>
                        {this.props.template.textAreas}
                    </div>

                    <div className="col-md-6 col-sm-12 py-3">
                        <p className="font-weight-bold">Images</p>
                        {this.props.template.mediaAreas}
                    </div>

                    <div className="col-12 pb-3">
                        {this.props.template.description}
                    </div>

                    {button}
                </div>
            </Panel>
        )
    }
}