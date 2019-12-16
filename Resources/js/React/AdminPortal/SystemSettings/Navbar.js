import React, { Component } from 'react';
import $ from 'jquery';

const baseUri = "/admin/settings/navbar";

export default class Navbar extends Component {
    constructor(props) {
        super(props);

        this.state = {
            navbar: [
                {},
                {}
            ]
        }
    }


    componentDidMount() { this.getData() };

    getData() {
        $.ajax({
            method: 'get',
            url: baseUri
        }).done((navbar) => {
            this.setState({ navbar });
        }).fail((err) => {
            console.err(err);
        })
    }

    render() {
        return (
            <div className="row">
                <div className="col-md-6 col-sm-12">
                    <NavPreview />
                    
                    <NavPreview />
                </div>

                <div className="col-md-6 col-sm-12">
                    //options
                </div>
            </div>
        )
    }
}

class NavPreview extends Component {
    render() {
        return (
            <div>
                <h2>..section.. Navbar</h2>
            </div>
        )
    }
}