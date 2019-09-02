import React, { Component } from 'react';
import PageMast from '../CMS-Blocks/PageTitle';
import TextBlock from '../CMS-Blocks/Text';
import Media from '../CMS-Blocks/Media';

import $ from 'jquery';


const baseUri = "/api/page"

export default class ReactTemplate2 extends Component {
    constructor(props) {
        super(props);

        this.state = {
            data: null,
            pageId: null,
        }
    }

    componentDidMount() {
        if (!document.getElementById('react_template_2')) {
            throw `Failed to attach component. Attribute 'data-pageid' was not found`;
        }

        this.setState({
            pageId: document.getElementById('react_template_2').getAttribute("data-pageid")
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
                    <div className="col-12 px-0 mb-4" style={{ 'margin-top': '-1rem' }}>
                        <Media />
                    </div>

                    <PageTitle title={this.props.data.name}
                        public={this.props.data.public}
                        created={this.props.data.created}
                    />                  

                    <div className="col-lg-6 col-md-12 py-2">
                        <TextBlock
                            u={this.getData.bind(this)}
                            baseUri={baseUri}
                            admin={this.state.data && !!this.state.data.settings}
                            content={this.state.data ? this.state.data.text[0] : null}
                            settings={this.state.data ? this.state.data.settings : null}
                        />
                    </div>

                    <div className="col-lg-6 col-md-12">
                        <TextBlock
                            u={this.getData.bind(this)}
                            baseUri={baseUri}
                            admin={this.state.data && !!this.state.data.settings}
                            content={this.state.data ? this.state.data.text[1] : null}
                            settings={this.state.data ? this.state.data.settings : null}
                        />
                    </div>
                </div>
            </React.Fragment>
        );
    }
}