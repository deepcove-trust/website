import React, { Component } from 'react';

import Email from './Email';
import Status from './Status';
import Phone from './Phone';
import Timestamps from './Timestamps';
import { DeleteUser, ResetPassword } from './AccountBtns';

export default class AccountCard extends Component {
    render() {
        return (
            <div className="col-lg-4 col-md-6 col-sm-12">
                <div class="card">
                    <div class="card-body">
                        <h4 class="text-center pb-3">{this.props.account.name || ""}</h4>

                        <Email email={this.props.account.email}
                            accountId={this.props.account.id}
                            baseUri={this.props.baseUri}
                            u={this.props.u}
                        />

                        <Phone phone={this.props.account.phoneNumber}
                            accountId={this.props.account.id}
                            baseUri={this.props.baseUri}
                            u={this.props.u}
                        />
                        
                        <Status active={this.props.account.active}
                            accountId={this.props.account.id}
                            baseUri={this.props.baseUri}
                            u={this.props.u}
                        />

                        <Timestamps timestamps={this.props.account.timestamps}/>
                        
                        <ResetPassword accountId={this.props.account.id}
                            baseUri={this.props.baseUri}
                            u={this.props.u}
                        />

                        <DeleteUser accountId={this.props.account.id}
                            baseUri={this.props.baseUri}
                            u={this.props.u}
                        />
                    </div>
                </div>
            </div>
        );
    }
}