import React, { Component } from 'react';
import NavOverview from './Navbar/NavOverview';
import NavSettings from './Navbar/NavSettings';
import $ from 'jquery';

const baseUri = "/admin/settings/navbar";

export default class Navbar extends Component {
    constructor(props) {
        super(props);

        this.state = {
            navbar: null,
            pages: {},
            activeId: 0,
            addingNew: false
        }
    }


    componentDidMount() { this.getData() };

    getData(initialId) {
        $.ajax({
            method: 'get',
            url: baseUri
        }).done((navbar) => {
            this.setState({
                navbar,
                activeId: initialId || (navbar[0] ? navbar[0].id : 0),
                addingNew: false
            });
        }).fail((err) => {
            console.log(err);
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
        if (!this.state.navbar || this.state.navbar.length <= 0) return null;

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

        // If link has not been saved yet, just remove from state by refreshing data
        if (id == 0) {
            return this.getData();
        }

        $.ajax({
            method: 'delete',
            url: `${baseUri}/${id}`
        }).done(() => {
            this.props.alert.success('Link removed successfully');
            this.getData();
        }).fail((err) => {
            this.props.alert.error(null, err.responseText);
        });
    }

    // Strips away fields that the API doesn't care about
    cleanLink(linkData) {

        if (linkData.type == 'Page') {
            return {
                'id': linkData.id,
                'pageId': linkData.pageId,
                'text': linkData.text ? linkData.text : null,
                'section': linkData.section == 'main' ? 0 : 1
            };
        }

        if (linkData.type == 'URL') {
            return {
                'id': linkData.id,
                'url': linkData.url,
                'text': linkData.text,
                'section': linkData.section == 'main' ? 0 : 1
            }
        }

        if (linkData.type == 'Dropdown') {
            return {
                'id': linkData.id,
                'text': linkData.text,
                'section': linkData.section == 'main' ? 0 : 1,
                'children': linkData.children ? linkData.children.map((sublink) => {
                    if (sublink.type == 'Page') {
                        return {
                            'pageId': sublink.pageId,
                            'text': sublink.text ? sublink.text : null
                        }
                    }
                    else return {
                        'text': sublink.text,
                        'url': sublink.url
                    }
                }) : []
            }
        }
    }

    updateLink(linkData) {        
        let link = this.cleanLink(linkData);
        $.ajax({
            method: 'put',
            url: baseUri,
            data: { navitem: JSON.stringify(link) },
        }).done((linkId) => {
            this.getData(linkId);
            this.props.alert.success("Changes saved!")
        }).fail((err) => {
            this.props.alert.error(null, err.responseText);
        })
    }

    createLink(section) {
        var navlinks = this.state.navbar;
        navlinks.push({
            id: 0,
            section: section,
            text: 'New Link',
            type: 'Page',
            pageName: null,
            pageId: null
        })
        this.setState({
            navbar: navlinks,
            activeId: 0,
            addingNew: true
        })
    }

    reorderLinks(section, ids, id) {
        $.ajax({
            method: 'patch',
            url: `${baseUri}?section=${section}`,
            data: { navitems: JSON.stringify(ids) }
        }).done(() => {
            this.getData(id);
            this.props.alert.success("Changes saved!")
        }).fail((err) => {
            this.props.alert.error(null, err.responseText);
        });
    }

    render() {
        return (
            <div className="row">
                <div className="col-lg-3 col-md-6 col-sm-12">
                    <NavOverview links={this.state.navbar}
                        activeId={this.state.activeId}
                        setActive={this.setActive.bind(this)}
                        onAdd={this.createLink.bind(this)}
                        onReorder={this.reorderLinks.bind(this)}
                        addingNew={this.state.addingNew}
                    />
                </div>

                <div className="col-lg-9 col-md-6 col-sm-12">
                    <NavSettings link={this.getPage()}
                        onDelete={this.deleteLink.bind(this, this.state.activeId)}
                        onSave={this.updateLink.bind(this)}
                        pages={this.state.pages}
                        addingNew={this.state.addingNew}
                    />
                </div>
            </div>
        )
    }
}