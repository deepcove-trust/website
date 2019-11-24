import React, { Component, Fragment } from 'react';
import Rselect from 'react-select';// This select needs to be diff to the one below
import { Input, FormGroup, Select } from '../../../Components/FormControl';
import { Button, ConfirmButton } from '../../../Components/Button';
import Panel from '../../../Components/Panel';
import { isEmptyObj } from '../../../../helpers';
import _ from 'lodash';

export default class NavSettings extends Component {
    constructor(props) {
        super(props);

        this.state = {
            link: _.cloneDeep(this.props.link)
        }
    }

    componentWillUpdate(nextProps) {
        if (nextProps.link != this.props.link) {
            this.setState({
                link: _.cloneDeep(nextProps.link)
            });
        }
    }

    revert() {
        this.setState({
            link: _.cloneDeep(this.props.link)
        });
    }

    updateLink(key, val) {
        let link = this.state.link;
        link[key] = val;
        this.setState({
            link: link
        });
    }

    render() {
        //let OptionsTemplate = !this.state.type ? null :
        //    this.state.type == 'A Page' ? Page :
        //        this.state.type == 'A Dropdown' ? Dropdown : CustomUrl;

        //let Options = OptionsTemplate ? <OptionsTemplate /> : null;

        return (
            <Fragment>
                <h4>Settings</h4>
                <Panel>
                    <div className="row">
                        <div className="col-md-6 col-sm-12">
                            <LinkName link={this.state.link} update={this.updateLink.bind(this, 'text')}/>
                        </div>

                        <div className="col-md-6 col-sm-12">
                            <LinkType link={this.state.link} update={this.updateLink.bind(this, 'type')} />
                        </div>
                    </div>
                    

                    {/* <CustomUrl link={this.state.link} update={this.updateLink.bind(this, 'url')} /> */}
                    <Page link={this.state.link} pages={this.props.pages}
                        update={this.updateLink.bind(this, 'pageId')}
                    />

                    <div>
                        <hr />
                        <ConfirmButton className="btn btn-outline-danger btn-sm" disabled>
                            Delete Link <i className="fas fa-trash"/>
                        </ConfirmButton>

                        {/*TODO: Disable the button if no changes have been made */}
                        <Button className={`btn btn-success btn-sm float-right`} disabled
                            cb={this.revert.bind(this)}
                        >
                            Save <i className="fas fa-check" />
                        </Button>

                        <Button className={`btn btn-danger btn-sm float-right`} disabled
                            cb={this.revert.bind(this)}
                        >
                            Reset <i className="fas fa-times"/>
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
                    value={this.props.link ? this.props.link.text || this.props.link.pageName : ""}
                    cb={this.props.update}
                />
            </FormGroup>
        );
    }
}

class LinkType extends Component {
    render() {
        let link = this.props.link;
        let selected = !link ? "Select...." :
            'pageId' in link ? 'A Page' :
                'children' in link ? 'A Dropdown' :
                    'url' in link ? 'A Custom URL' : null;

        return (
            <FormGroup htmlFor="link_type" label="What should the link open?" required>
                <Select id="link_type"
                    options={["A Page", "A Dropdown", "A Custom URL"]}
                    selected={selected}
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
        if(page) this.props.update(page.value);
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

class Dropdown extends Component {
    render() {
        return ("Dropdown SETTINGS");
    }
}