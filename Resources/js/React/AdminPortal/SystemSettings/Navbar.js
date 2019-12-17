import React, { Component } from 'react';
import NavOverview from './Navbar/NavOverview';
import NavSettings from './Navbar/NavSettings';
import $ from 'jquery';

const baseUri = "/admin/settings/navbar";

export default class Navbar extends Component {
    constructor(props) {
        super(props);

        this.state = {
            navbar: [],
            pages: {},
            activeId: 0
        }
    }


    componentDidMount() { this.getData() };

    getData(initialId) {
        console.log(`Initial ID set to ${initialId}`);
        $.ajax({
            method: 'get',
            url: baseUri
        }).done((navbar) => {
            this.setState({
                navbar,
                activeId: initialId || (navbar[0] ? navbar[0].id : 0)
            });
        }).fail((err) => {
            console.err(err);
        })

        $.ajax({
            method: 'get',
            url: `/admin/pages/data?filter=all`
        }).done((pages) => {
            this.setState({
                pages
            });
        })
    }

    getPage() {
        if (this.state.navbar.length <= 0) return null;

        return this.state.navbar.find(obj => {
            return obj.id == this.state.activeId
        });
    }

    setActive(id) {
        this.setState({
            activeId: id
        });
    }

    deleteLink(id) {
        $.ajax({
            method: 'delete',
            url: `${baseUri}/${id}`
        }).done(() => {
            console.log(`Nav link ${id} deleted successfully`);
            this.getData();
        }).fail((err) => {
            console.log(err);
        });
    }

    cleanLink(linkData) {
        console.log('Dirty link');
        console.log(linkData);

        if (linkData.type == 'Page') {            
            return {
                'id': linkData.id,
                'pageId': linkData.pageId,
                'text': linkData.text ? linkData.text : null
            };
        }

        if (linkData.type == 'Custom URL') {
            return {
                'id': linkData.id,
                'url': linkData.url,
                'text': linkData.text
            }
        }

        if (linkData.type == 'DropDown') {

        }
    }

    updateLink(linkData) {
        let link = this.cleanLink(linkData);
        console.log("Cleaned link:");
        console.log(link);
        $.ajax({
            method: 'put',
            url: baseUri,
            data: { navitem: JSON.stringify(link) },
        }).done(() => {
            console.log(`Nav link ${link.id} edited successfully`);
            this.getData(link.id);
        }).fail((err) => {
            console.log(err);
        })
    }

    render() {
        return (
            <div className="row">
                <div className="col-lg-3 col-md-6 col-sm-12">
                    <NavOverview links={this.state.navbar}
                        activeId={this.state.activeId}
                        setActive={this.setActive.bind(this)}
                    />
                </div>

                <div className="col-lg-9 col-md-6 col-sm-12">
                    <NavSettings link={this.getPage()}
                        onDelete={this.deleteLink.bind(this, this.state.activeId)}
                        onSave={this.updateLink.bind(this)}
                        pages={this.state.pages}
                    />
                </div>
            </div>
        )
    }
}