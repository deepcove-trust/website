import React, { Component } from 'react';
import { render } from 'react-dom';
import ChangePassword from './Account/ChangePassword';
import Settings from './Account/Settings';
import NotificationChannels from './Account/NotificationChannels';
import $ from 'jquery';

const baseUri = `/admin/account`;

export default class Account extends Component {
    constructor(props) {
        super(props);

        this.state = {
            account: null
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
            this.setState({ account: data });
        }).fail((err) => {
            console.error(`[Account@getData] Error getting data: `, err.responseText);
        })
    }

    render() {
        return (
            <div className="container">
                <div className="row">
                    <div className="col-12 pb-3">
                        <h1 className="text-center">My Account</h1>
                    </div>

                    <div className="col-12">
                        <div className="row">
                            <div className="col-lg-4 col-md-6 col-sm-12">
                                <Settings account={this.state.account}
                                    u={this.getData.bind(this)}
                                    baseUri={baseUri}
                                />
                            </div>

                            <div className="col-lg-4 col-md-6 col-sm-12">
                                <ChangePassword
                                    baseUri={baseUri}
                                />
                            </div>

                            <div className="col-lg-4 col-md-6 col-sm-12">
                                <NotificationChannels baseUri={baseUri}
                                    cb={this.getData.bind(this)}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

if (document.getElementById('react_account')) 
    render(<Account />, document.getElementById('react_account'));    