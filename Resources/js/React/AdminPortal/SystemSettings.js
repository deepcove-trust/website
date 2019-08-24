import React, { Component } from 'react';
import { render } from 'react-dom';

import ContactInformation from './SystemSettings/ContactInformation';
import FooterQuickLinks from './SystemSettings/FooterQuickLinks';

import $ from 'jquery';

const baseUri = `/admin/web/settings`;

export default class SystemSettings extends Component {
    constructor(props) {
        super(props);

        this.state = {
            settings: null,
            activeTab: null
        }
    }

    componentDidMount() {

        this.setState({
            activeTab: document.getElementById('react_systemSettings').getAttribute("data-tab")
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
        if (!this.state.settings)
            return null;

        let activePage = (
            <ContactInformation contact={this.state.settings.contact}
                u={this.getData.bind(this)}
                baseUri={baseUri}
            />
        )

        if (this.state.activeTab == "footer") {
            activePage = (
                <FooterQuickLinks sections={this.state.settings.quickLinks}
                    u={this.getData.bind(this)}
                    baseUri={baseUri}
                />
            )
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


if (document.getElementById('react_systemSettings'))
    render(<SystemSettings />, document.getElementById('react_systemSettings'));    