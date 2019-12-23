import React, { Component } from 'react';
import { Section } from './FooterQuickLinks/Section';
import $ from 'jquery';

const baseUri = "/admin/settings/quicklinks";

export default class FooterQuickLinks extends Component {
    constructor(props) {
        super(props);

        this.state = {
            quickLinks: { a: null, b: null, avaliable: null },
            default: null,
        }
    }

    componentDidMount() {
        this.getData();
    }

    getData() {
        $.ajax({
            method: 'get',
            url: baseUri
        }).done((quickLinks) => {
            this.setState({
                quickLinks: _.cloneDeep(quickLinks),
                default: _.cloneDeep(quickLinks)
            });
        });
    }

    render() {
        return (
            <div className="row">
                <div className="col-lg-6 col-md-12">
                    <Section section={this.state.quickLinks.a || null}
                        avaliable={this.state.quickLinks.avaliable || null}
                        u={this.getData.bind(this)}
                        baseUri={baseUri}
                        sectionId={1} // Enum ID = QuickLinks.A
                        alert={this.props.alert}
                    />
                </div>

                <div className="col-lg-6 col-md-12">
                    <Section section={this.state.quickLinks.b || null}
                        avaliable={this.state.quickLinks.avaliable || null}
                        u={this.getData.bind(this)}
                        baseUri={baseUri}
                        sectionId={2} // Enum ID = QuickLinks.B
                        alert={this.props.alert}
                    />
                </div>
            </div>
        )
    }
}