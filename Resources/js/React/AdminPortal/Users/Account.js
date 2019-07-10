import React, { Component } from 'react';
import Button from '../../Components/Button';
import { FormGroup, Input, Select } from '../../Components/FormControl';

import $ from 'jquery';

export default class Account extends Component {
    render() {
        return (
            <div className="col-lg-4 col-md-6 col-sm-12">
                <div class="card">
                    <img class="card-img-top w-100 d-block" src="/images/background.jpg" style={{ 'height': '120px' }}/>
                    <div class="card-body">
                        <h4 class="text-center pb-3">{this.props.account.name || ""}</h4>

                        <FormGroup>
                            <label htmlFor="email">Email</label>
                            <Input id="email" type="email" autoComplete="email" value={this.props.account.email} />
                        </FormGroup>

                        <FormGroup>
                            <label htmlFor="phone">Phone</label>
                            <Input id="phone" type="text" autoComplete="phone" value={this.props.account.phoneNumber} />
                        </FormGroup>

                        <FormGroup>
                            <label htmlFor="status">Status</label>
                            <Select id="status" options={["Active", "Inactive"]} selected={this.props.account.active ? "Active" : "Inactive"} /> 
                        </FormGroup>

                        <div className="row">
                            <div className="col-lg-6 col-md-12">
                                <label>Account Created</label>
                                <p>{this.props.account.timestamps.signup}</p>
                            </div>

                            <div className="col-lg-6 col-md-12">
                                <label>Last Active</label>
                                <p>{this.props.account.timestamps.lastLogin}</p>
                            </div>
                        </div>

                        <Button btnClass="btn btn-dark mt-3 mx-1">
                            Reset Password <i className="fas fa-user-lock"></i>
                        </Button>

                        <Button btnClass="btn btn-danger mt-3 mx-1">
                            Delete User <i className="fas fa-user-times"></i>
                        </Button>
                    </div>
                </div>
            </div>
        );
    }
}