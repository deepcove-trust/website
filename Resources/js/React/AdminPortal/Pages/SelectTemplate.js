import React, { Component, Fragment } from 'react';
import { Button, ConfirmModal } from '../../Components/Button';
import PreviewCard from './PreviewCard';
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
            templates = this.state.templates.map((template, key) => {
                // We show the active template first, let's keep it out of this list!
                if (this.props.activeTemplate && this.props.activeTemplate.id == template.id)
                    return;

                return (
                    <div className="col-lg-4 col-md-6 col-sm-12 mb-3" key={key}>
                        <Template template={template} showButton="true" active={this.props.activeTemplate || null} cb={this.props.cb} />
                    </div>
                )
            });
        }

        let currentTemplate;
        if (this.props.activeTemplate) {
            currentTemplate = (
                <div className="col-lg-4 col-md-6 col-sm-12 mb-3">
                    <Template template={this.props.activeTemplate}
                        active={this.props.activeTemplate || null}
                        cb={this.props.cb}
                    />
                </div>
            )
        }

        return (
            <section className="fade1sec">
                <div className="row">
                    <div className="col-12 py-3">
                        <h1 className="text-center pb-3">Select a Template</h1>
                    </div>

                    {currentTemplate}
                    {templates}

                    <div className="col-12">
                        <Button className="btn btn-info float-left" cb={this.props.goBack.bind(this, 1)}>
                            <i className="far fa-arrow-circle-left"></i> Back
                        </Button>
                    </div>
                </div>
            </section>
        )
    }
}

class Template extends Component {
    render() {
        let button; 
        if (!this.props.active) {
            button = (
                <Button className="btn btn-info d-block mx-auto" cb={this.props.cb.bind(this, this.props.template)}>
                    Use this template <i className="fas fa-check"></i>
                </Button>
            )
        } else if (this.props.active && this.props.active.id == this.props.template.id) {
            button = (
                <Button className="btn btn-success d-block mx-auto" cb={this.props.cb.bind(this, this.props.template)}>
                    Keep this template <i className="fas fa-check"></i>
                </Button>
            );
        } else {
            let html = <ModalMessage active={this.props.active} template={this.props.template} />;
            button = (
                <ConfirmModal className="btn btn-info d-block mx-auto" question="change template" actionText="Yes, Change my Template" explanation={html} cb={this.props.cb.bind(this, this.props.template)}>
                    Use This Template <i className="fas fa-exclamation-circle"></i>
                </ConfirmModal>
            );
        }

        return (
            <PreviewCard imgurl={`/images/templates/${this.props.template.id}.png`}>
                <div className="text-center">
                    <h4 className="mt-1 mb-0">{this.props.template.name}</h4>
                    <p className="text-muted">{`${this.props.template.textAreas} Text Fields | ${this.props.template.mediaAreas} Media Fields`}</p>
                    {button}
                </div>
            </PreviewCard>
        )
    }
}