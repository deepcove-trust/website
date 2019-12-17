import React, { Component, Fragment } from 'react';
import { isEmptyObj } from '../../../../../helpers';
import Rselect from 'react-select';
import { Select, Input } from '../../../../Components/FormControl';

export default class Dropdown extends Component {

    constructor(props) {
        super(props);

        this.state = {
            sublinks: this.props.sublinks
        }
    }

    render() {
        var sublinks = this.state.sublinks.map((sublink, index) => {
            return <SublinkDetails link={sublink} pages={this.props.pages} key={index} />
        });

        console.log(this.state.sublinks);
        return (
            <Fragment>
                <h5>Dropdown Links</h5>
                {sublinks}
            </Fragment>
        )

    }
}

class SublinkDetails extends Component {
    constructor(props) {
        super(props);

        this.state = {
            link: this.props.link,            
            type: null
        }
    }

    componentDidMount() {
        this.setState({
            type: this.getSublinkType()
        })
    }

    getSublinkType() {
        return this.state.link.url ? 'URL' : 'Page';
    }

    handleTypeChange(newType) {
        this.setState({
            type: newType
        })
    }

    render() {

        return (
            <div className="row mb-2">
                <div className="col-md-5">
                    <SublinkName link={this.state.link} />
                </div>
                <div className="col-md-2">
                    <SublinkType linkType={this.state.type} update={this.handleTypeChange.bind(this)} />
                </div>
                <div className="col-md-5">
                    <Page link={this.state.link} pages={this.props.pages} />
                </div>
            </div>
        )

    }
}

class SublinkType extends Component {
    render() {
        return (
            <Select id="sublink_type"
                options={["Page", "URL"]}
                selected={this.props.linkType}
                cb={this.props.update}
            />
        );
    }
}

class SublinkName extends Component {
    render() {
        return (
            <Input id="link_text" type="text"
                value={this.props.link ? this.props.link.text : ""}
                placeHolder={this.props.link ? this.props.link.pageName : ""}
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