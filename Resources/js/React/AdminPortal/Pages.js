import React, { Component } from 'react';
import { render } from 'react-dom';
import { Link } from '../Components/Button';
import PagePreview from './Pages/PagePreview';
import $ from 'jquery';
import { Input, FormGroup } from '../Components/FormControl';

const baseUri = `/admin/pages`;

export default class Pages extends Component {
    constructor(props) {
        super(props);

        this.state = {
            pages: null,
            filter: "main"
        }
    }

    componentDidMount() {
        this.getData();
    }

    getData() {
        if (!document.getElementById('react_PagesDirectory')) {
            throw `Failed to attach component. Attribute 'data-filter' was not found`;
        }

        this.setState({
            filter: document.getElementById('react_PagesDirectory').getAttribute("data-filter")
        }, () => {
            $.ajax({
                type: 'get',
                url: `${baseUri}/data?filter=${this.state.filter}`
            }).done((data) => {
                this.setState({ pages: data });
            }).fail((err) => {
                console.log(err.responseText);
            });
        });
    }

    render() {
        let pages;
        if (this.state.pages) {
            pages = this.state.pages.map((page, key) => {
                if (this.state.search && !page.name.includes(this.state.search)) return <div />

                return (
                    <div className="col-lg-4 col-md-6 col-sm-12" key={key}>
                        <PagePreview page={page} u={this.getData.bind(this)} />
                    </div>
                )
            });
        }

        return (
            <div className="row">
                <div className="col-12">
                    <h1 className="text-center">Pages</h1>
                </div>

                <div className="col-md-4">
                    <FormGroup label="Search:">
                        <Input type="text" placeHolder="Page name..." value={this.state.search} cb={(search) => this.setState({ search })}/>
                    </FormGroup>
                </div>

                <div className="col-md-4 offset-md-4 mb-3">
                    <Link className="btn btn-info float-right" href={`${baseUri}/create?filter=${this.state.filter}`}>
                        New Page <i className="fas fa-file-plus"></i>
                    </Link>
                </div>

                {pages}
            </div>
        );
    }
}

if (document.getElementById('react_PagesDirectory'))
    render(<Pages />, document.getElementById('react_PagesDirectory'));    