import React, { Component } from 'react';
import AccountIcons from './AccountIcons';
import md5 from 'md5';

export default class AccountCard extends Component {
    getAvatarUrl(email) {
        // Settings
        const apiUrl = "http://www.gravatar.com/avatar";
        const size = 100;//Options: https://en.gravatar.com/site/implement/images#size
        const rating = "g";//Options: https://en.gravatar.com/site/implement/images#rating

        // No email provided
        if (!email) return;
        // Prepare the email
        email = email.toLowerCase().trim();
        // Return the Gravatar string
        return `${apiUrl}/${md5(email)}?r=${rating}&s=${size}`;
    }

    render() {
        const { active, developer, email, forcePasswordReset, id, name, phoneNumber, timestamps } = this.props.account;
              
        return (
            <div className="col-lg-4 col-md-6 col-sm-12 user-item">
                <img className="avatar" src={this.getAvatarUrl(email)} alt={`${name}'s gravatar`} />
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
            </div>
        )
    }
}