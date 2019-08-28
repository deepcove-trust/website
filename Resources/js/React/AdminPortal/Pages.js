import React, { Component } from 'react';
import { render } from 'react-dom';
import { Button } from '../Components/Button';
import $ from 'jquery';

const baseUri = `/admin/web/pages`;

export default class Pages extends Component {
    constructor(props) {
        super(props);

        this.state = {
            pages: null,
            filter: "main"
        }
    }

    componentDidMount() {
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
        return (
            <div className="row">
                <div className="col-12">
                    <h1 className="text-center">Pages</h1>
                    <Button btnClass="btn btn-primary float-right" cb={() => window.location.replace(`${baseUri}/new?filter=${this.state.filter}`)}>
                        New Page <i class="fas fa-file-plus"></i>
                    </Button>
                </div>
            </div>
        );
    }
}

if (document.getElementById('react_PagesDirectory'))
    render(<Pages />, document.getElementById('react_PagesDirectory'));    