import React, { Component, Fragment } from 'react';
import { isEmptyObj } from '../../../../../helpers';
import Rselect from 'react-select';
import { Select, Input } from '../../../../Components/FormControl';

export default class Dropdown extends Component {
    updateSublink(index, key, val) {
        console.log(`Setting ${key} to ${val}`);
        var sublinks = this.props.sublinks;
        var sublink = sublinks[index];
        sublink[key] = val;
        if (key == 'pageId') {
            sublink['text'] = null;
            sublink['pageName'] = this.props.pages.find((page) => page.id == sublink['pageId']).name;
        }
        
        this.props.update(sublinks);        
    }

    deleteSublink(index) {
        console.log(`Deleting ${index}`)
        var sublinks = this.props.sublinks;
        sublinks.splice(index, 1);
        this.props.update(sublinks);
    }

    addSublink() {
        var sublinks = this.props.sublinks;
        sublinks.push({
            text: 'New link',
            type: 'URL',
            url: ''
        })
        this.props.update(sublinks);
    }

    render() {
        var sublinks = this.props.sublinks.map((sublink, index) => {
            return (
                <SublinkDetails sublink={sublink}
                    pages={this.props.pages}
                    key={index}
                    onChange={this.updateSublink.bind(this, index)}
                    onDelete={this.deleteSublink.bind(this, index)} />
            )
        });

        return (
            <Fragment>
                <hr />
                <h5>Dropdown Links</h5>
                {sublinks.length > 0 ? sublinks : <p>No links configured</p>}
                <button className="btn btn-dark btn-sm d-block ml-auto mr-0 my-3" onClick={this.addSublink.bind(this)}>Add Link &nbsp; <i className="fas fa-plus" /></button>
            </Fragment>
        )

    }
}

class SublinkDetails extends Component {
    render() {        

        var options =
            this.props.sublink.type == "Page" ?
                <Page link={this.props.sublink} pages={this.props.pages} update={this.props.onChange.bind(this, 'pageId')} />
                : <CustomUrl link={this.props.sublink} update={this.props.onChange.bind(this, 'url')} />



        return (
            <div draggable='true' className="row mb-2">
                <div className="px-1 mb-1 col-md-4">
                    <SublinkName sublink={this.props.sublink} update={this.props.onChange.bind(this, 'text')} />
                </div>
                <div className="px-1 mb-1 col-md-2">
                    <SublinkType linkType={this.props.sublink.type} update={this.props.onChange.bind(this, 'type')} />
                </div>
                <div className="px-1 mb-1 col-md-6">
                    <div className='row'>
                        <div className='col-10'>{options}</div>
                        <div className='px-0 col-2'>
                            <button className='btn btn-danger' onClick={this.props.onDelete}>
                                <i className='fas fa-trash'></i>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

class SublinkType extends Component {
    render() {
        return (
            <Select options={["Page", "URL"]}
                selected={this.props.linkType}
                cb={this.props.update}
            />
        );
    }
}

class SublinkName extends Component {
    render() {
        return (
            <Input type="text"
                value={this.props.sublink ? this.props.sublink.text : ""}
                placeHolder={this.props.sublink ? this.props.sublink.pageName : ""}
                cb={this.props.update}
            />
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
            <Rselect options={options} passive
                value={options.filter((x) => x.value == this.props.link.pageId)[0]}
                onChange={this.handleClick.bind(this)}
            />
        );
    }
}

class CustomUrl extends Component {
    render() {
        if (!this.props.link || !'url' in this.props.link) return null;

        return (
            <Input id="customurl" type="url"
                value={this.props.link.url || ""}
                placeHolder="https://example.com"
                required
                cb={this.props.update}
            />
        );
    }
}