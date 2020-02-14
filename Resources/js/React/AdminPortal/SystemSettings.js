import React, { Component } from 'react';
import { render } from 'react-dom';
import Alert from '../Components/Alert';
import ContactInformation from './SystemSettings/ContactInformation';
import FooterQuickLinks from './SystemSettings/FooterQuickLinks';
import Navbar from './Systemsettings/Navbar';
import ErrorBoundary from '../Errors/ErrorBoundary';

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
            if (o.tab.toLowerCase() == tabName.replace('_', ' ')) {
                this.setState({
                    tabIndex: k
                });
            }
        })
    }

    updateIndex(tabIndex) {
        this.setState({
            tabIndex
        });
    }

    render() {
        const SettingsPage = components[this.state.tabIndex || 0].template;

        return (
            <ErrorBoundary customError="react-system-settings">
                <Alert onRef={ref => (this.Alert = ref)}>
                    <div className="row">
                        <div className="col-12 py-3">
                            <h1 className="text-center">Website Settings</h1>
                            <PageTabs tabIndex={this.state.tabIndex}
                                pages={components}
                                cb={this.updateIndex.bind(this)}
                            />

                            <div className="fade1sec">
                                <SettingsPage alert={this.Alert} />
                            </div>
                        </div>
                    </div>
                </Alert>
            </ErrorBoundary>
        );
    }
}

export class PageTabs extends Component {
    tabNameToUrl(x) {
        return x.toLowerCase().replace(' ', '_');
    }

    handleClick(i, url) {
        // Change tabs
        this.props.cb(i);
        // Change URL without reloading the browser
        let newUrl = `${window.location.protocol}//${window.location.host}${window.location.pathname}?tab=${url}`
        window.history.pushState({ path: newUrl }, document.title, newUrl);
    }

    render() {
        let pages = this.props.pages;

        let tabs = pages ? Object.values(pages).map((page, key) => {
            return (
                <li className="nav-item" key={key}>
                    <a className={`btn nav-link ${key == this.props.tabIndex ? 'active' : ''}`}
                        onClick={this.handleClick.bind(this, key, this.tabNameToUrl(page.tab))}
                    >
                        {page.tab}
                    </a>
                </li>
            )
        }) : null;


        return (
            <ul className="nav nav-pills mb-5 justify-content-center">
                {tabs}
            </ul>
        )
    }
}

if (document.getElementById('react_systemSettings'))
    render(<SystemSettings />, document.getElementById('react_systemSettings'));    