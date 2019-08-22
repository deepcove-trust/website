import React, { Component } from 'react';
import { render } from 'react-dom';

import ContactInformation from './SystemSettings/ContactInformation';
import FooterQuickLinks from './SystemSettings/FooterQuickLinks';

import $ from 'jquery';

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
        let activePage;
        if (this.state.settings) {
            activePage = (
                <ContactInformation contact={this.state.settings.contact}
                    u={this.getData.bind(this)}
                    baseUri={baseUri}
                />
            )
        } else if (this.state.activeTab == "footer") {
            activePage = <FooterQuickLinks />;
        }

        return (
            <div className="row">
                <div className="col-12">
                    <h1 className="text-center">System Settings</h1>
                    <PageTabs activeTab={this.state.activeTab} />

                    {activePage}
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
                    <li className="nav-item">
                        <a className={`nav-link ${tab.url == this.props.activeTab ? 'active' : ''}`} href={`?tab=${tab.url}`}>{tab.tabName}</a>
                    </li>
                )
            });
        }

        return (
            <ul className="nav nav-tabs mb-3">
                {tabs}
            </ul>
        )
    }
}


if (document.getElementById('react_websiteSettings'))
    render(<Settings />, document.getElementById('react_websiteSettings'));    