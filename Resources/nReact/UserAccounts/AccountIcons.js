import React, { Component, Fragment } from 'react';
import ReactTooltip from 'react-tooltip';

const iconTooltips = {
    dev: "Developer Account:<br/>You cannot update this account",
    inactive: "Disabled Account:<br/>This account cannot be used until enabled by an administrator",
    passwordReset: "Password Reset Required:<br/>This account cannot be used until the user resets their password"
}

export default class AccountIcons extends Component {
    render() {
        const { active, developer, locked } = this.props;

        let icon_dev = developer ? (
            <li className="list-inline-item">
                <i className="fas fa-code" data-tip={iconTooltips.dev}/>
            </li>
        ) : null;

        let icon_inactive = !active ? (
            <li className="list-inline-item text-danger">
                <i className="fas fa-user-slash" data-tip={iconTooltips.inactive}/>
            </li>
        ) : null;

        let icon_passwordreset = locked ? (
            <li className="list-inline-item text-danger">
                <i className="fas fa-user-lock" data-tip={iconTooltips.passwordReset}/>
            </li>
        ) : null



        return (
            <Fragment>
                <ul className="list-unstyled">
                    {icon_dev}
                    {icon_inactive}
                    {icon_passwordreset}
                </ul>

                <ReactTooltip multiline={true}/>
            </Fragment>
        )
    }
}