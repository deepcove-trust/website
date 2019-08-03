import React, { Component } from 'react';
import { render } from 'react-dom';
import Panel from '../Components/Panel';
import { FooterSettings } from './WebSettings/FooterSettings';
import { QuickLinks } from './WebSettings/QuickLinks';
import $ from 'jquery';


const baseUri = `/admin/web/settings`;

export default class Settings extends Component {
    constructor(props) {
        super(props);

        this.state = {
            settings: null
        }
    }

    componentDidMount() {
        this.getData();
    }

    getData() {
        $.ajax({
            type: 'get',
            url: `${baseUri}/data`
        }).done((data) => {
            this.setState({ settings: data });
        }).fail((err) => {
            console.error(`[User@getData] Error getting data: `, err.responseText);
        })
    }

    render() {
        return (
            <div className="row">
                <div className="col-12">
                    <h1 className="text-center">Website Settings</h1>
                    <Panel>
                        <FooterSettings
                            settings={this.state.settings}
                            baseUri={baseUri}
                            u={this.getData.bind(this)}
                        />

                        <hr />

                        <QuickLinks
                            settings={this.state.settings}
                            baseUri={baseUri}
                            u={this.getData.bind(this)}
                        />
                    </Panel>
                </div>
            </div>
        );
    }
}

if (document.getElementById('react_websiteSettings'))
    render(<Settings />, document.getElementById('react_websiteSettings'));    