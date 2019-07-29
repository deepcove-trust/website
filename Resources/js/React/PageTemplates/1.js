﻿import React, { Component } from 'react';
import { render } from 'react-dom';
import { Button } from '../Components/Button';
import { FormGroup, Input, TextArea } from '../Components/FormControl';
import $ from 'jquery';


export default class ReactTemplate extends Component {
    constructor(props) {
        super(props);

        this.state = {
            data: null,
            settings: null
        }
    }

    componentDidMount() {
        this.getData();
    }

    getData() {

    }

    render() {
        
        return (
            <React.Fragment>
                <div className="row">
                    <div className="col-12">
                        <h1>**Page Name**</h1>
                        <div className="row">
                            <div className="col-lg-4 col-md-6 col-sm-12">
                                <h6>Text Region Heading</h6>
                                <p>This is a text region with no content.</p>
                            </div>

                            <div className="col-lg-4 col-md-6 col-sm-12">
                                <h6>Text Region Heading</h6>
                                <p>This is a text region with no content.</p>
                            </div>

                            <div className="col-lg-4 col-md-6 col-sm-12">
                                <h6>Text Region Heading</h6>
                                <p>This is a text region with no content.</p>
                            </div>
                        </div>
                    </div>

                    <div className="col-lg-6 col-md-12">
                        <h3>Drop us an Email</h3>
                        <form>
                            <FormGroup htmlFor="name" label="Your Name:" required>
                                <Input id="name" type="text" name="name" autocomplete="name" required />
                            </FormGroup>

                            <FormGroup htmlFor="org" label="Organization:">
                                <Input id="org" type="text" name="org" autocomplete="organization" />
                            </FormGroup>

                            <FormGroup htmlFor="phone" label="Contact Phone Number:">
                                <Input id="phone" type="text" name="phone" autocomplete="phone" />
                            </FormGroup>

                            <FormGroup htmlFor="email" label="Email:" required>
                                <Input id="email" type="email" name="email" autocomplete="email" required />
                            </FormGroup>

                            <FormGroup htmlFor="subject" label="Subject:" required>
                                <Input id="subject" type="text" name="subject" autocomplete="off" />
                            </FormGroup>

                            <FormGroup htmlFor="message" label="Message:" required>
                                <TextArea id="message" maxLength="100" required/>
                            </FormGroup>

                            <Button type="submit" pending={false}>
                                Send Email &nbsp;
                                <i className="fas fa-envelope"></i>
                            </Button>
                        </form>
                    </div>

                    <div className="col-lg-6 col-md-12">
                        <h3>Where to Find Us</h3>
                        <iframe width="100%" frameborder="0" style={{ border: 0, height: 50 + 'vh' }} src="https://www.google.com/maps/embed/v1/place?key=AIzaSyAfo1AATDgkVuNqry2jt7oYnONdyrfc2cM
                            &amp;q=Deep+Cove+School+Hostel&amp;center=-45.322628,167.232328&amp;zoom=9&amp;maptype=satellite" allowfullscreen="">
                        </iframe>
                    </div>
                </div>
            </React.Fragment>
        );
    }
}

if (document.getElementById('react_template_1'))
    render(<ReactTemplate />, document.getElementById('react_template_1'));    