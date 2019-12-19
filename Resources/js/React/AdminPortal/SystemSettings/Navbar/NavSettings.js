import React, { Component, Fragment } from 'react';
import Rselect from 'react-select';// This select needs to be diff to the one below
import { Input, FormGroup, Select } from '../../../Components/FormControl';
import { Button, ConfirmButton } from '../../../Components/Button';
import Panel from '../../../Components/Panel';
import { isEmptyObj } from '../../../../helpers';
import Dropdown from './NavSettings/Dropdown';
import $ from 'jquery';
import _ from 'lodash';

const baseUri = "/admin/settings/navbar"

export default class NavSettings extends Component {
    constructor(props) {
        super(props);

        this.state = {
            link: {},
            modified: false
        }
    }

    componentDidUpdate(prevProps) {
        if (prevProps.link != this.props.link) {
            this.getData();
        }
    }

    getData() {
        if (!this.props.link) return;

        // Do not attempt to fetch data from API for a new link
        if (this.props.link.id == 0) {
            var link = {
                text: 'New link',
                page: 0,
                type: 'Page',
                section: this.props.link.section,
                children: []
            }
            this.setState({
                link: link,
                modified: false
            });
            return;
        }

        $.ajax({
            method: 'get',
            url: `${baseUri}/${this.props.link.id}`
        }).done((link) => {
            link.type = this.getLinkType(link);
            link.section = this.props.link.section;
            if (link.children) {
                link.children.forEach((sublink) => sublink.type = this.getLinkType(sublink));
            } else link.children = []
            this.setState({
                link: link,
                modified: false
            });
        });
    }

    getLinkType(obj) {
        if (!obj) return null;
        if ('children' in obj) return 'Dropdown';
        if ('url' in obj) return 'URL';
        else return 'Page';
    }

    updateLink(key, val) {
        let link = this.state.link;
        link[key] = val;
        this.setState({
            link: link,
            modified: true
        });
    }

    // Updates the pageId and text and page name fields whenever a new page is linked
    updateLinkedPage(pageId) {
        this.updateLink('pageId', pageId);
        this.updateLink('text', null);
        var page = this.props.pages.find((page) => page.id == pageId);
        this.updateLink('pageName', page.name);
    }

    render() {
        let options = (
            <Page link={this.state.link} pages={this.props.pages}
                update={this.updateLinkedPage.bind(this)}
            />
        );

        options = this.state.link.type == "Dropdown" ? (
            <Dropdown sublinks={this.state.link.children} pages={this.props.pages}
                update={this.updateLink.bind(this, 'children')}
            />
        ) : this.state.link.type == "URL" ? (
            <CustomUrl link={this.state.link}
                update={this.updateLink.bind(this, 'url')}
            />
        ) : options;

        if (!this.props.link) {
            return (
                <Fragment>
                    <h4>Settings</h4>
                    <Panel>
                        <h5 className='text-center'>Add a navbar link to begin</h5>
                    </Panel>
                </Fragment>
            )
        }

        return (
            <Fragment>
                <h4>Settings</h4>
                <Panel>
                    <div className="row">
                        <div className="col-md-6 col-sm-12">
                            <LinkName link={this.state.link} update={this.updateLink.bind(this, 'text')} />
                        </div>

                        <div className="col-md-6 col-sm-12">
                            <LinkType linkType={this.state.link.type} update={this.updateLink.bind(this, 'type')} />
                        </div>
                    </div>

                    {/*


                    */}

                    {options}

                    <div>
                        <hr />
                        <ConfirmButton className="btn btn-outline-danger btn-sm" cb={this.props.onDelete.bind(this)}>
                            Delete Link <i className="fas fa-trash" />
                        </ConfirmButton>

                        <Button className={`btn btn-success btn-sm float-right`}
                            disabled={!this.state.modified}
                            cb={this.props.onSave.bind(this, this.state.link)}
                        >
                            Save <i className="fas fa-check" />
                        </Button>

                        <Button className={`btn btn-danger btn-sm float-right`}
                            disabled={!this.state.modified}
                            cb={this.getData.bind(this)}
                        >
                            Reset <i className="fas fa-times" />
                        </Button>
                    </div>
                </Panel>
            </Fragment>
        );
    }
}

class LinkName extends Component {
    render() {
        return (
            <FormGroup htmlFor="link_text" label="Link Text" required>
                <Input id="link_text" type="text"
                    value={this.props.link ? this.props.link.text : ""}
                    placeHolder={this.props.link ? this.props.link.pageName : ""}
                    cb={this.props.update}
                />
            </FormGroup>
        );
    }
}

class LinkType extends Component {
    render() {
        return (
            <FormGroup htmlFor="link_type" label="What should the link open?" required>
                <Select id="link_type"
                    options={["Page", "Dropdown", "URL"]}
                    selected={this.props.linkType}
                    cb={this.props.update}
                />
            </FormGroup>
        );
    }
}

class CustomUrl extends Component {
    render() {
        if (!this.props.link || !'url' in this.props.link) return null;

        return (
            <FormGroup htmlFor="customurl" label="Enter a custom url:" required>
                <Input id="customurl" type="url"
                    value={this.props.link.url || ""}
                    placeHolder="https://example.com"
                    required
                    cb={this.props.update}
                />
                <small className="text-muted font-italic">
                    <span className="font-weight-bold">Help:</span> Custom URLs should link to another website. They will open in a new tab.
                </small>
            </FormGroup>
        );
    }
}

class Page extends Component {
    handleClick(page) {
        if (page) this.props.update(page.value);
    }

    render() {
        if (!this.props.link || !'pageId' in this.props.link || isEmptyObj(this.props.pages)) return null;

        let options = this.props.pages.map((page) => {
            return { value: page.id, label: page.name };
        });

        return (
            <FormGroup htmlFor="page" label="Select ONE page" required>
                <Rselect options={options} passive
                    value={options.filter((x) => x.value == this.props.link.pageId)[0]}
                    onChange={this.handleClick.bind(this)}
                />
            </FormGroup>
        );
    }
}