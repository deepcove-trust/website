import React, { Component } from 'react';

import Email from './Email';
import Phone from './Phone';
import Status from './Status';
import Timestamps from './Timestamps';
import Panel from '../../Components/Panel';
import { validateEmail } from '../../../helpers';
import { DeleteUser, ResetPassword, EditButtons } from './AccountBtns';

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
            mode: Mode.View,
            account: _.cloneDeep(this.props.account),
            error: null
        }
    }

    updateVal(field, val) {
        let account = this.state.account;
        switch (field) {
            case "email":
                account.email = val;
                break;
            case "phone":
                account.phoneNumber = val;
                break;
            case "status":
                account.active = (val == "Active") ? true : false;
                break;
        }
        
        this.setState({
            account: account
        });
    }

    setMode(x) {
        this.setState({
            mode: x
        });
    }

    cancel() {
        this.setState({
            mode: Mode.View,
            account: _.cloneDeep(this.props.account)
        });
    }

    updateAccount() {
        // Validate
        if (!validateEmail(this.state.account.email)) {
            this.setState({
                error: "Please enter a valid email address."
            }, () => {
                console.error(`${this.state.account.email} is not an RFC2822 compliant email address.`)
            });
        } else {
            $.ajax({
                type: 'put',
                url: `${this.props.baseUri}/${this.state.account.id}`,
                data: {
                    email: this.state.account.email,
                    phone: this.state.account.phoneNumber,
                    status: this.state.account.active
                }
            }).done(() => {
                this.props.u();
                this.setState({
                    mode: Mode.View,
                    error: null
                });
            }).fail((err) => {
                console.error(`[AccountCard@updateAccount] Error updating account data: `, err.responseText);
            });
        }
    }

    render() {
        return (
            <div className="col-lg-4 col-md-6 col-sm-12">
                <Panel onSubmit={this.updateAccount.bind(this)}>
                    <h4 class="text-center">{this.state.account.name || ""}</h4>
                    
                    <EditButtons mode={this.state.mode}
                        setModeCb={this.setMode.bind(this)}
                        cancelCb={this.cancel.bind(this)}
                        updateCb={this.updateAccount.bind(this)}
                    />

                    <Email mode={this.state.mode}
                        value={this.state.account.email}
                        accountId={this.props.accountId}
                        error={this.state.error}
                        cb={this.updateVal.bind(this, 'email')}
                    />

                    <Phone mode={this.state.mode}
                        value={this.state.account.phoneNumber}
                        accountId={this.props.account.id}
                        cb={this.updateVal.bind(this, 'phone')}
                    />
                        
                    <Status mode={this.state.mode}
                        value={this.state.account.active ? "Active" : "Inactive"}
                        accountId={this.props.account.id}
                        cb={this.updateVal.bind(this, 'status')}
                    />

                    <Timestamps timestamps={this.state.account.timestamps}/>
                        
                    <ResetPassword accountId={this.props.account.id}
                        baseUri={this.props.baseUri}
                        u={this.props.u}
                    />

                    <DeleteUser accountId={this.props.account.id}
                        baseUri={this.props.baseUri}
                        u={this.props.u}
                    />    
                </Panel>
            </div>
        );
    }
}