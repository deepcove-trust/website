import React, { Component } from 'react';
import { render } from 'react-dom';
import GoogleMap from '../CMS-Blocks/GoogleMap';
import PageMast from '../CMS-Blocks/PageMast';
import TextBlock from '../CMS-Blocks/Text';
import EmailForm from '../CMS-Blocks/EmailForm';
import $ from 'jquery';


const baseUri = "/api/page"

export default class ReactTemplate1 extends Component {
    constructor(props) {
        super(props);

        this.state = {
            data: null,
            pageId: null,
        }
    }

    componentDidMount() {
        if (!document.getElementById('react_template_1')) {
            throw `Failed to attach component. Attribute 'data-pageid' was not found`;
        }

        this.setState({
            pageId: document.getElementById('react_template_1').getAttribute("data-pageid")
        }, () => {
            this.getData();
        });
    }

    getData() {           
        $.ajax({
            type: 'get',
            url: `${baseUri}/${this.state.pageId}`
        }).done((data) => {
            this.setState({
                data: data
            });
        }).fail((err) => {
            console.error(err);
        });
    }

    render() {
        return (
            <React.Fragment>
                <div className="row">
                    <PageMast page={this.state.data}
                        baseUri={baseUri}
                        u={this.getData.bind(this)}
                    />

                    <div className="col-12  pb-4">
                        <div className="row">
                            <div className="col-lg-4 col-md-6 col-sm-12">
                                <TextBlock
                                    u={this.getData.bind(this)}
                                    baseUri={baseUri}
                                    admin={this.state.data && !!this.state.data.settings}
                                    content={this.state.data ? this.state.data.text[0] : null}
                                    settings={this.state.data ? this.state.data.settings : null}
                                />
                            </div>

                            <div className="col-lg-4 col-md-6 col-sm-12">
                                <TextBlock
                                    u={this.getData.bind(this)}
                                    baseUri={baseUri}
                                    admin={this.state.data && !!this.state.data.settings}                                    
                                    content={this.state.data ? this.state.data.text[1] : null}
                                    settings={this.state.data ? this.state.data.settings : null}
                                />
                            </div>

                            <div className="col-lg-4 col-md-6 col-sm-12">
                                <TextBlock
                                    u={this.getData.bind(this)}
                                    baseUri={baseUri}
                                    admin={this.state.data && !!this.state.data.settings}
                                    content={this.state.data ? this.state.data.text[2] : null}
                                    settings={this.state.data ? this.state.data.settings : null}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="col-lg-6 col-md-12 pb-2">
                        <EmailForm config={this.state.data ? this.state.data.other.captchaSiteKey : null }/>
                    </div>

                    <div className="col-lg-6 col-md-12">
                        <GoogleMap title="Where to Find Us"
                            config={this.state.data ? this.state.data.other.googleMaps : null } />
                    </div>
                </div>
            </React.Fragment>
        );
    }
}

if (document.getElementById('react_template_1'))
    render(<ReactTemplate />, document.getElementById('react_template_1'));    