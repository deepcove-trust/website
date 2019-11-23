import React, { Component } from 'react';
import NavOverview from './Navbar/NavOverview';
import $ from 'jquery';

const baseUri = "/admin/settings/navbar";

export default class Navbar extends Component {
    constructor(props) {
        super(props);

        this.state = {
            navbar: {
                education: { },
                main: {},
            },
            activeId: 0
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

    setActive(id) {
        console.log(id)
        this.setActive({
            activeId: id
        });
    }

    render() {
        let previews = [];
        for (let [key, value] of Object.entries(this.state.navbar)) {
            previews.push(
                <NavOverview section={key}
                    links={value}
                    activeId={this.state.activeId}
                    setActive={this.setActive}
                    key={key}
                />
            );
        }

        return (
            <div className="row">
                <div className="col-lg-3 col-md-6 col-sm-12">
                    {previews}
                </div>

                <div className="col-lg-9 col-md-6 col-sm-12">
                    //options
                </div>
            </div>
        )
    }
}