import React, { Component } from 'react';
import { render } from 'react-dom';
import { Button } from '../Components/Button';
import { FormGroup, Input, TextArea } from '../Components/FormControl';
import GoogleMap from '../CMS-Blocks/GoogleMap';
import PageMast from '../CMS-Blocks/PageMast';
import TextBlock from '../CMS-Blocks/Text';
import $ from 'jquery';


const baseUri = "/api/page"

export default class ReactTemplate extends Component {
    constructor(props) {
        super(props);

        this.state = {
            data: null,
            pageId: null,
        }
    }

    componentDidMount() {
        if (!document.getElementById('react_template_1')) {
            throw `Failed to attach component. Attribute 'data-pageid' was not found`;
        }

        this.setState({
            pageId: document.getElementById('react_template_1').getAttribute("data-pageid")
        }, () => {
            this.getData();
        });
    }

    getData() {           
        $.ajax({
            type: 'get',
            url: `${baseUri}/${this.state.pageId}`
        }).done((data) => {
            this.setState({
                data: data
            });
        }).fail((err) => {
            console.error(err);
        });
    }

    render() {
        return (
            <React.Fragment>
                <div className="row">
                    <PageMast page={this.state.data}
                        baseUri={baseUri}
                        u={this.getData.bind(this)}
                    />

                    <div className="col-12  pb-4">
                        <div className="row">
                            <div className="col-lg-4 col-md-6 col-sm-12">
                                <TextBlock
                                    u={this.getData.bind(this)}
                                    baseUri={baseUri}
                                    admin={this.state.data && !!this.state.data.settings}
                                    content={this.state.data ? this.state.data.text[0] : null}
                                    settings={this.state.data ? this.state.data.settings : null}
                                />
                            </div>

                            <div className="col-lg-4 col-md-6 col-sm-12">
                                <TextBlock
                                    u={this.getData.bind(this)}
                                    baseUri={baseUri}
                                    admin={this.state.data && !!this.state.data.settings}                                    
                                    content={this.state.data ? this.state.data.text[1] : null}
                                    settings={this.state.data ? this.state.data.settings : null}
                                />
                            </div>

                            <div className="col-lg-4 col-md-6 col-sm-12">
                                <TextBlock
                                    u={this.getData.bind(this)}
                                    baseUri={baseUri}
                                    admin={this.state.data && !!this.state.data.settings}
                                    content={this.state.data ? this.state.data.text[2] : null}
                                    settings={this.state.data ? this.state.data.settings : null}
                                />
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
                                <TextArea id="message" maxLength="500" required/>
                            </FormGroup>

                            <Button type="submit" pending={false}>
                                Send Email &nbsp;
                                <i className="fas fa-envelope"></i>
                            </Button>
                        </form>
                    </div>

                    <div className="col-lg-6 col-md-12">
                        <GoogleMap title="Where to Find Us" />
                    </div>
                </div>
            </React.Fragment>
        );
    }
}

if (document.getElementById('react_template_1'))
    render(<ReactTemplate />, document.getElementById('react_template_1'));    