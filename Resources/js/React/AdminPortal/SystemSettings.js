import React, { Component } from 'react';
import { render } from 'react-dom';

import ContactInformation from './SystemSettings/ContactInformation';
import FooterQuickLinks from './SystemSettings/FooterQuickLinks';
import Navbar from './Systemsettings/Navbar';

const components = {
    0: {
        template: ContactInformation,
        tab: 'Contact Information'
    }, 
    1: {
        template: FooterQuickLinks,
        tab: 'Footer Quick-Links'
    },
    2: {
        template: Navbar,
        tab: 'Navbar Management'
    }
}

export default class SystemSettings extends Component {
    constructor(props) {
        super(props);

        this.state = {
            tabIndex: 0,
        }
    }

    componentDidMount() {
        // Get the active tabname from the URL query string
        let tabName = document.getElementById('react_systemSettings').getAttribute("data-tab");
        Object.values(components).map((o, k) => {
            if (o.tab == tabName.replace('_', ' ')) {
                this.setState({
                    tabIndex: k
                });
            }
        })
    }

    render() {
        const SettingsPage = components[this.state.tabIndex].template;

        return (
            <div className="row">
                <div className="col-12 py-3">
                    <h1 className="text-center">Website Settings</h1>
                    <PageTabs tabIndex={this.state.tabIndex}
                        pages={components}
                    />

                    <div className="fade3sec">
                        <SettingsPage />
                    </div>
                </div>
            </div>
        );
    }
}

export class PageTabs extends Component {
    tabNameToUrl(x) {
        return x.toLowerCase().replace(' ', '_');
    }

    render() {
        let pages = this.props.pages;

        let tabs = pages ? Object.values(pages).map((page, key) => {
            return (
                <li className="nav-item" key={key}>
                    <a className={`nav-link ${key == this.props.tabIndex ? 'active' : ''}`}
                        href={`?tab=${this.tabNameToUrl(page.tab)}`}
                    >
                        {page.tab}
                    </a>
                </li>
            )           
        }) : null;


        return (
            <ul className="nav nav-pills mb-3 justify-content-center">
                {tabs}
            </ul>
        )
    }
}

if (document.getElementById('react_systemSettings'))
    render(<SystemSettings />, document.getElementById('react_systemSettings'));    