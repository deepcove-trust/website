import React, { Component } from 'react';
import { render } from 'react-dom';
import { FooterSettings } from './WebSettings/FooterSettings';
import { QuickLinks } from './WebSettings/QuickLinks';
import $ from 'jquery';
import ContactInformation from './SystemSettings/ContactInformation';


const baseUri = `/admin/web/settings`;

export default class Settings extends Component {
    constructor(props) {
        super(props);

        this.state = {
            settings: null,
            activeTab: null
        }
    }

    componentDidMount() {

        this.setState({
            activeTab: document.getElementById('react_websiteSettings').getAttribute("data-tab")
        }, () => {
            this.getData();
        })    
    }

    getData() {
        $.ajax({
            type: 'get',
            url: `${baseUri}/data`
        }).done((data) => {
            this.setState({
                settings: data
            });
        }).fail((err) => {
            console.error(`[User@getData] Error getting data: `, err.responseText);
        })
    }

    render() {
        //<Panel>
        //    <FooterSettings
        //        settings={this.state.settings}
        //        baseUri={baseUri}
        //        u={this.getData.bind(this)}
        //    />

        //    <hr />

        //    <QuickLinks
        //        settings={this.state.settings}
        //        baseUri={baseUri}
        //        u={this.getData.bind(this)}
        //    />
        //</Panel>

        let activePage;

        return (
            <div className="row">
                <div className="col-12">
                    <h1 className="text-center">Website Settings</h1>
                    <PageTabs activeTab={this.state.activeTab} />

                    <ContactInformation />
                </div>
            </div>
        );
    }
}

export class PageTabs extends Component {
    render() {
        const tabsArray = [
            {
                url: "contact",
                tabName: "Contact Information"
            },
            {
                url: "footer",
                tabName: "Footer Quick-Links"
            }
        ]

        let tabs;
        if (tabsArray) {
            tabs = tabsArray.map((tab) => {
                return (
                    <li className="nav-item pb-2">
                        <a className={`nav-link ${tab.url == this.props.activeTab ? 'active' : ''}`} href={`?tab=${tab.url}`}>{tab.tabName}</a>
                    </li>
                )
            });
        }

        return (
            <ul className="nav nav-tabs">
                {tabs}
            </ul>
        )
    }
}


if (document.getElementById('react_websiteSettings'))
    render(<Settings />, document.getElementById('react_websiteSettings'));    