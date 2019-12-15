import React, { Component } from 'react';
import { Email, Phone, Status } from './Settings';
import { DeleteUser, ResetPassword, EditButtons } from './AccountBtns';
import Panel from '../../Components/Panel';
import Timestamps from './Timestamps';

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

    render() {
        return (
            <div className="col-lg-4 col-md-6 col-sm-12 mb-2">
                <Panel onSubmit={this.props.saveChanges.bind(this)}>
                    <h4 className="text-center">{this.state.account.name || ""}</h4>
                    
                    <EditButtons mode={this.state.mode}
                        setModeCb={this.setMode.bind(this)}
                        cancelCb={this.cancel.bind(this)}
                        updateCb={this.props.saveChanges.bind(this, this.state.account)}
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
                        
                    <ResetPassword account={this.props.account}
                        requestPending={this.props.requestPending}
                        forceReset={this.props.forceReset}
                    />

                    <DeleteUser account={this.props.account}
                        requestPending={this.props.requestPending}
                        deleteUser={this.props.deleteUser}
                    />
                </Panel>
            </div>
        );
    }
}