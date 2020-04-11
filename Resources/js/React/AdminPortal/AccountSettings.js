import React, { Component } from 'react';
import { render } from 'react-dom';
import Settings from './AccountSettings/Settings';
import ChangePassword from './AccountSettings/ChangePassword';
import NotificationChannels from './AccountSettings/Notifications';
import Alert from '../Components/Alert';

import $ from 'jquery';
import ErrorBoundary from '../Errors/ErrorBoundary';
import { GravatarUrl } from '../../helpers';

const baseUri = `/admin/account`;

export default class AccountSettings extends Component {
    constructor(props) {
        super(props);

        this.state = {
            account: { email: null }
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
            this.setState({
                account: data.account,
                channels: data.availableChannels
            });
        }).fail((err) => {
            console.error(`[Account@getData] Error getting data: `, err.responseText);
        })
    }

    getChannelMemberships() {
        return this.state.account ? this.state.account.notificationChannels : null;
    }

    render() {
        return (
            <ErrorBoundary customError="react-account-settings">
                <Alert className="container" onRef={ref => (this.Alert = ref)}>
                    <div className="row">
                        <div className="col-12 py-3">
                            <h1 className="text-center">Account Settings</h1>
                        </div>

                        <div className="col-lg-4 col-md-6 col-sm-12">
                            <Settings account={this.state.account}
                                u={this.getData.bind(this)}
                                alert={this.Alert}
                                baseUri={baseUri}
                            />
                        </div>

                        <div className="col-lg-4 col-md-6 col-sm-12">
                            <ChangePassword baseUri={baseUri}
                                u={this.getData.bind(this)}
                                alert={this.Alert}
                            />
                        </div>

                        <div className="col-lg-4 col-md-6 col-sm-12">
                            <NotificationChannels baseUri={baseUri}
                                channelMemberships={this.getChannelMemberships()}
                                channels={this.state.channels}
                                u={this.getData.bind(this)}
                                alert={this.Alert}
                            />

                            <div className="pt-3">
                                <img className="float-left mr-2" src={GravatarUrl(this.state.account.email)} alt={`${this.state.account.name}'s gravatar`} />
                                <p>We use Gravatar's API for your account avatar. You can change it <a href="https://en.gravatar.com/" target="_blank">here</a>.</p>    
                            </div>
                        </div>
                    </div>
                </Alert>
            </ErrorBoundary>
        );
    }
}

if (document.getElementById('react_accountSettings'))
    render(<AccountSettings />, document.getElementById('react_accountSettings'));    