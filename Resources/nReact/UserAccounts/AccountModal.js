import React, { Component } from 'react';
import AccountIcons from './AccountIcons';
import Modal from '../../js/React/Components/Modal';
import { FormGroup, Input } from '../../js/React/Components/FormControl';
import { BtnGroup, ConfirmButton } from '../../js/React/Components/Button';

export default class AccountModal extends Component {
    constructor(props) {
        super(props);

        this.state = {
            account: this.props.account,
            edit: false,
            pending: false
        }
    }

    componentWillReceiveProps(newProps) {
        if (newProps.account != this.props.account) {
            this.setState({
                account: newProps.account
            });
        }
    }

    _handelEditMode(edit) {
        this.setState({
            account: this.props.account,
            edit
        });
    }

    _handleDelete(id) {
        $.ajax({
            method: 'delete',
            url: `${this.props.baseUrl}/${id}`
        }).done((message) => {
            this.props.Alert.success(message);
            this.props.updateData();
            this.props.handleHideModal();
        }).fail((err) => {
            this.props.Alert.error(null, err.responseText);
        })
    }

    _handleUpdateAccount(account) {
        $.ajax({
            method: 'put',
            url: `${this.props.baseUrl}/${account.id}`,
            data: {
                email: account.email,
                id: account.id,
                name: account.name,
                phoneNumber: account.phoneNumber
            },
            beforeSend: this.updatePending(true),
            always: this.updatePending(false)
        }).done((msg) => {
            this._handelEditMode(false);
            this.props.Alert.success(msg);
            this.props.updateData();
        }).fail((err) => this.props.Alert.error(null, err.responseText));
    }

    _handleUpdateAccountFlags(id, flag) {
        $.ajax({
            method: 'put',
            url: `${this.props.baseUrl}/${id}/${flag}`
        }).done((message) => {
            this.props.Alert.success(message);
            this.props.updateData();
        }).fail((err) => {
            this.props.Alert.error(null, err.responseText);
        })
    }

    _handleUpdateAccountVal(key, val) {
        let account = this.state.account;
        account[key] = val;
        this.setState({
            account
        });
    }

    updatePending(pending) { this.setState({ pending }) };
    
    render() {
        if (!this.props.showModal) return null;

        const { active, developer, email, id, forcePasswordReset, name, notificationChannels, phoneNumber, timestamps } = this.state.account;
        const { edit } = this.state;

        let buttons = !edit ? (
            <div className="dropdown">
                <button className="btn btn-dark dropdown-toggle" type="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                    Account Actions
                </button>
                <div className="dropdown-menu" aria-labelledby="dropdownMenuButton">
                    <a className="dropdown-item" onClick={this._handelEditMode.bind(this, true)}>Edit</a>
                    <a className="dropdown-item" onClick={this._handleUpdateAccountFlags.bind(this, id, 'status')}>{active ? 'Disable' : 'Enable'} Account</a>
                    <a className="dropdown-item" onClick={this._handleUpdateAccountFlags.bind(this, id, 'reset')}>Force Password Reset</a>
                </div>
            </div>
        ) : (
            <BtnGroup>
                <ConfirmButton className="btn btn-danger" pending={this.state.pending} cb={this._handelEditMode.bind(this, false)}>
                    Cancel <i className="fas fa-times" />
                </ConfirmButton>
                <ConfirmButton className="btn btn-success" pending={this.state.pending} cb={this._handleUpdateAccount.bind(this, this.state.account)}>
                    Update <i className="fas fa-check" />
                </ConfirmButton>
            </BtnGroup>    
            );

        let emailTypes = notificationChannels.map((emailType, key) => {
            return <li key={key}>{emailType}</li>
        });

        return (
            <Modal title="Account Detials" size="lg" handleHideModal={this.props.handleHideModal}>
                <div className="row">
                    <div className="col-md-6 col-sm-12">
                        <FormGroup label="Name:" required>
                            <Input type="text" value={name} cb={this._handleUpdateAccountVal.bind(this, 'name')} readOnly={!edit}/>
                        </FormGroup>

                        <FormGroup label="Email:" required>
                            <Input type="email" value={email} cb={this._handleUpdateAccountVal.bind(this, 'email')} readOnly={!edit} />
                        </FormGroup>

                        <FormGroup label="Phone Number:">
                            <Input type="phone" value={phoneNumber} cb={this._handleUpdateAccountVal.bind(this, 'phoneNumber')} readOnly={!edit} />
                        </FormGroup>
                    </div>

                    <div className="col-md-6 col-sm-12">
                        <p className="font-weight-bold">Account Flags:</p>
                        <span className="display-4">
                            <AccountIcons active={active} developer={developer} locked={forcePasswordReset} />
                        </span>

                        <p className="font-weight-bold">Recieves email types:</p>
                        <ul>{emailTypes}</ul>
                    </div>
                </div>

                <div className="row pb-3">
                    <div className="col-md-6 col-sm-12">
                        <FormGroup label="Account Created:">
                            &nbsp; {timestamps.signup}
                        </FormGroup>
                    </div>

                    <div className="col-md-6 col-sm-12">
                        <FormGroup label="Last Login:">
                            &nbsp; {timestamps.lastLogin}
                        </FormGroup>
                    </div>
                </div>

                <div className="row">
                    <div className="col-md-6 col-sm-12">
                        {buttons}
                    </div>

                    <div className="col-md-6 col-sm-12">
                        <ConfirmButton className="btn btn-danger float-right" cb={this._handleDelete.bind(this, id)}>
                            Delete Account <i className="fas fa-user-times" />
                        </ConfirmButton> 
                    </div>
                </div>
            </Modal>    
        )
    }
}