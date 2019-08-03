import React, { Component } from 'react';
import { Input, FormGroup, TextArea } from '../../Components/FormControl';
import { Button } from '../../Components/Button';
import Alert from '../../Components/Alert';
import $ from 'jquery';

export class QuickLinks extends Component {
    constructor(props) {
        super(props);
        this.state = {
            pending: false,

            sections: [
                {
                    title: "Beds",
                    pages: [
                        {
                            title: "Apartments",
                            url: "https://example.com"
                        },
                        {
                            title: "Lodge",
                            url: "https://example.com"
                        },
                        {
                            title: "Hostel",
                            url: "https://example.com"
                        }
                    ]
                },
                {
                    title: "Things",
                    pages: [
                        {
                            title: "",
                            url: ""
                        },
                        {
                            title: "",
                            url: ""
                        },
                        {
                            title: "",
                            url: ""
                        }
                    ]
                }
            ]
        }
    }


    //submitForm(e) {
    //    e.preventDefault();

    //    //this.setState({
    //    //    pending: true
    //    //}, () => {
    //    //    $.ajax({
    //    //        type: 'post',
    //    //        url: this.props.baseUri,
    //    //        data: this.state.settings
    //    //    }).done(() => {
    //    //        // Refresh the page so
    //    //        // we see the footer update.
    //    //        location.reload();
    //    //    }).fail((err) => {
    //    //        console.log(err.responseText);
    //    //    })
    //    //});
    //}

    render() {
        let sections;
        if (this.props.settings) {
            sections = this.state.sections.map((section, key) => {
                return <Section section={section} index={key}/>;
            })
        }
            
        return (
            <div className="row">
                <div className="col-12">
                    <h4 class="pb-3">Quick Links</h4>
                    <Alert type="primary">This feature is not yet implemented</Alert>
                </div>
                
                {sections}
            </div>
        )
    }
}

export class Section extends Component {
    render() {
        let currentPages;
        if (this.props.section.pages) {
            currentPages = this.props.section.pages.map((page) => {
                return (
                    <tr>
                        <td>
                            <a href={page.url}>
                                {page.title}
                            </a>
                        </td>
                        <td>
                            <button className="btn btn-danger btn-sm float-right" type="button" disabled>
                                Remove Quick Link &nbsp;
                                <i className="fas fa-times"></i>
                            </button>
                        </td>
                    </tr>
                )
            });
        }
        return (
            <div className="col-lg-6 col-md-6 col-sm-12">
                <FormGroup htmlFor={`title-${this.props.index + 1}`} label={`Section ${this.props.index + 1} Title: `} required>
                    <Input type="text" id={`title-${this.props.index + 1}`} value={this.props.section.title}/>
                </FormGroup>

                <FormGroup>
                    <p>** Select Box Here **</p>
                </FormGroup>

                <div class="table-responsive">
                    <table class="table table-hover table-sm">
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentPages}
                        </tbody>
                    </table>
                </div>
            </div>    
        )
    }
}