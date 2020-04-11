import React, { Component } from 'react';
import AccountIcons from './AccountIcons';
import AccountModal from './AccountModal';
import { GravatarUrl } from '../../js/helpers';

export default class AccountCard extends Component {
    constructor(props) {
        super(props);

        this.state = {
            showModal: false
        }
    }

    handleModal(showModal) {
        this.setState({
            showModal
        });
    }
    
    render() {
        const { active, developer, email, forcePasswordReset, id, name, phoneNumber, timestamps } = this.props.account;
              
        return (
            <div className="col-lg-4 col-md-6 col-sm-12 user-item" onClick={this.handleModal.bind(this, true)}>
                <img className="avatar" src={GravatarUrl(email)} alt={`${name}'s gravatar`} />
                <h3 className="name">{name}</h3>
                <ul className="list-unstyled mb-1">
                    <li>
                        <i className="fas fa-envelope" /> &nbsp;
                        <a href={`mailto:${email}`}>{email}</a>
                    </li>
                    <li>
                        <i className="fas fa-phone" /> &nbsp;
                        <a href={`tel:${phoneNumber}`}>{phoneNumber}</a>
                    </li>
                </ul>

                <AccountIcons active={active} developer={developer} locked={forcePasswordReset} />
                <AccountModal showModal={this.state.showModal} handleHideModal={this.handleModal.bind(this)} updateData={this.props.updateData}
                    account={this.props.account} Alert={this.props.Alert} baseUrl={this.props.baseUrl}
                />
            </div>
        )
    }
}