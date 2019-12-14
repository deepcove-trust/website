import React, { Component } from 'react';
import { Email, Phone, Status } from './Settings';
import { DeleteUser, ResetPassword, EditButtons } from './AccountBtns';
import AlertWrapper from '../../Components/Alert';
import { validateEmail } from '../../../helpers';
import Panel from '../../Components/Panel';
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
            mode: Mode.View,
            account: _.cloneDeep(this.props.account),
        }
    }

    updateVal(field, val) {
        let account = this.state.account;
        account[field] = val;
       
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
        // Validate email against RFC2822
        if (!validateEmail(this.state.account.email)) {
            this.AlertWrapper('error', {
                ui: 'Please enter a valid email',
                debug: 'email is not RFC2822 compliant.'
            });
        } else {
            $.ajax({
                type: 'put',
                url: `${this.props.baseUri}/${this.state.account.id}`,
                data: this.state.account
            }).done(() => {
                this.setState({
                    mode: Mode.View,
                }, this.AlertWrapper.alert('success', 'Account settings updated'));

                this.props.u();
            }).fail((err) => {
                this.AlertWrapper.responseAlert('error', $.parseJSON(err.responseText));
            });
        }
    }

    render() {
        return (
            <AlertWrapper onRef={ref => (this.AlertWrapper = ref)}>
                <div className="col-lg-4 col-md-6 col-sm-12 mb-2">
                    <Panel onSubmit={this.updateAccount.bind(this)}>
                        <h4 className="text-center">{this.state.account.name || ""}</h4>
                    
                        <EditButtons mode={this.state.mode}
                            setModeCb={this.setMode.bind(this)}
                            cancelCb={this.cancel.bind(this)}
                            updateCb={this.updateAccount.bind(this)}
                        />

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
            </AlertWrapper>
        );
    }
}