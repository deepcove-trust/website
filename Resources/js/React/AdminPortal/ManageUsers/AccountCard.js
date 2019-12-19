import React, { Component } from 'react';
import { Email, Phone, Status } from './Settings';
import { validateEmail } from '../../../helpers'; 
import ResetPassword from './ResetPassword';
import Panel from '../../Components/Panel';
import EditButtons from './EditButtons';
import DeleteUser from './DeleteUser';
import Timestamps from './Timestamps';

import $ from 'jquery';
import _ from 'lodash';

const Mode = {
    View: 'view',
    Edit: 'edit'
}

export default class AccountCard extends Component {
    constructor(props) {
        super(props);

        this.state = {
            account: _.cloneDeep(this.props.account),
            requestPending: false,
            mode: Mode.View,   
        }
    }

    updateVal(field, val) {
        let account = this.state.account;
        account[field] = val;
       
        this.setState({
            account: account
        });
    }

    cancel() {
        this.setState({
            mode: Mode.View,
            account: _.cloneDeep(this.props.account)
        });
    }

    saveChanges(account) {
        this.setState({
            requestPending: true
        }, () => {
            // Validate email against RFC2822
            if (!validateEmail(account.email)) {
                this.Alert('error', {
                    ui: 'Please enter a valid email',
                    debug: 'email is not RFC2822 compliant.'
                });
            } else {
                $.ajax({
                    type: 'put',
                    url: `${this.props.baseUri}/${account.id}`,
                    data: account
                }).done(() => {
                    this.setState({
                        requestPending: false,
                        mode: Mode.View
                    }, () => {
                        this.props.alert.success('Account settings updated')
                        this.props.u();
                    });
                }).fail((err) => {
                    this.setState({
                        requestPending: false
                    }, this.props.alert.error(null, err.responseText))
                });
            }
        })
    }

    setMode(x) {
        this.setState({
            mode: x
        });
    }

    render() {
        return (
            <div className="col-lg-4 col-md-6 col-sm-12 mb-2">
                <Panel>
                    <h4 className="text-center">{this.state.account.name || ""}</h4>

                    <div className="text-center pb-2">
                        <EditButtons mode={this.state.mode}
                            cancelCb={this.cancel.bind(this)}
                            setModeCb={this.setMode.bind(this)}
                            pending={this.state.requestPending}
                            saveChangesCb={this.saveChanges.bind(this, this.state.account)}
                        />
                    </div>

                    <Email mode={this.state.mode}
                        value={this.state.account.email}
                        accountId={this.props.accountId}
                        cb={this.updateVal.bind(this, 'email')}
                    />

                    <Phone mode={this.state.mode}
                        value={this.state.account.phoneNumber}
                        accountId={this.props.account.id}
                        cb={this.updateVal.bind(this, 'phoneNumber')}
                    />
                        
                    <Status mode={this.state.mode}
                        value={this.state.account.active}
                        accountId={this.props.account.id}
                        cb={this.updateVal.bind(this, 'active')}
                    />

                    <Timestamps timestamps={this.state.account.timestamps}/>
                        
                    <ResetPassword account={this.props.account}
                        baseUri={this.props.baseUri}
                        alert={this.props.alert}
                        u={this.props.u}
                    />

                    <DeleteUser account={this.props.account}
                        baseUri={this.props.baseUri}
                        alert={this.props.alert}
                        u={this.props.u}
                    />
                </Panel>
            </div>
        );
    }
}