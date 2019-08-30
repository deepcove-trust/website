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
        console.log(!this.props.activeTemplate)
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
                    <div className="col-12">
                        <h1 className="text-center pb-3">Select a Template</h1>
                    </div>

                    {currentTemplate}
                    {templates}

                    <div className="col-12">
                        <Button btnClass="btn btn-info float-left" cb={this.props.goBack.bind(this, 1)}>
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
                <Button btnClass="btn btn-info d-block mx-auto" cb={this.props.cb.bind(this, this.props.template)}>
                    Use this template <i className="fas fa-check"></i>
                </Button>
            )
        } else if (this.props.active && this.props.active.id == this.props.template.id) {
            button = (
                <Button btnClass="btn btn-success d-block mx-auto" cb={this.props.cb.bind(this, this.props.template)}>
                    Keep this template <i className="fas fa-check"></i>
                </Button>
            );
        } else {
            let html = <ModalMessage active={this.props.active} template={this.props.template} />;
            button = (
                <ConfirmModal btnClass="btn btn-info d-block mx-auto" question="change template" actionText="Yes, Change my Template" explanation={html} cb={this.props.cb.bind(this, this.props.template)}>
                    Use This Template <i className="fas fa-exclamation-circle"></i>
                </ConfirmModal>
            );
        }

        return (
            <PreviewCard title={this.props.template.name}>   
                <div className="row text-center">
                    <div className="col-md-6 col-sm-12 py-3">
                        <p className="font-weight-bold">Text Fields</p>
                        {this.props.template.textAreas}
                    </div>

                    <div className="col-md-6 col-sm-12 py-3">
                        <p className="font-weight-bold">Images</p>
                        {this.props.template.mediaAreas}
                    </div>

                    <div className="col-12 pb-3" style={{ 'height': '92px' }}>
                        {this.props.template.description}
                    </div>

                    {button}
                </div>
            </PreviewCard>
        )
    }
}

class ModalMessage extends Component {
    render() {
        return (
            <Fragment>
                <p className="font-weight-bold">WARNING: Your selected templates may have a different number of media and/or text fields than your current template. Some information may be lost.</p>
                <div className="table-responsive">
                    <table className="table table-hover table-sm">
                        <thead>
                            <tr>
                                <th></th>
                                <th>Current Template</th>
                                <th>New Template</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>Text Fields: </td>
                                <td>{this.props.active.textAreas}</td>
                                <td>{this.props.template.textAreas}</td>
                            </tr>
                            <tr>
                                <td>Media Fields:</td>
                                <td>{this.props.active.mediaAreas}</td>
                                <td>{this.props.template.mediaAreas}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                <span>For more information please refer to your handbook.</span>
            </Fragment>
        )
    }
}