import React, { Component } from 'react';
import { Section } from './FooterQuickLinks/Section';

export default class FooterQuickLinks extends Component {
    render() {
        return (
            <div className="row">
                <div className="col-lg-6 col-md-12">
                    <Section section={this.props.sections.a}
                        avaliablePages={this.props.sections.avaliable}
                        baseUri={this.props.baseUri}
                        u={this.props.u}
                        sectionId={1} // Enum ID = QuickLinks.A
                    />
                </div>

                <div className="col-lg-6 col-md-12">
                    <Section section={this.props.sections.b}
                        avaliablePages={this.props.sections.avaliable}
                        baseUri={this.props.baseUri}
                        u={this.props.u}
                        sectionId={2} // Enum ID = QuickLinks.B
                    />
                </div>
            </div>
        )
    }
}