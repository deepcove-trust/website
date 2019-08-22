import React, { Component, Fragment } from 'react';
import { FormGroup, Input } from '../../Components/FormControl';

export default class FooterQuickLinks extends Component {
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

    render() {
        let currentPages;
        if (this.state.sections[0].pages) {
            currentPages = this.state.sections[0].pages.map((page) => {
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

        let dropdown = (
            <div class="dropdown">
                <button class="btn btn-info btn-sm float-right dropdown-toggle" data-toggle="dropdown" aria-expanded="false" type="button">Add Page </button>
                <div class="dropdown-menu" role="menu">
                    <a class="dropdown-item" role="presentation" href="#">First Item</a>
                </div>
            </div>
        )

        return (
            <div className="row">
                <div className="col-lg-6 col-md-12">
                    <FormGroup label="Section 1 Title" required>
                        <Input type="text"/>
                    </FormGroup>


                    <div class="table-responsive">
                        <table class="table table-hover table-sm">
                            <thead>
                                <tr>
                                    <th>Name</th>
                                    <th>{dropdown}</th>
                                </tr>
                            </thead>
                            <tbody>
                                {currentPages}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        )
    }
}