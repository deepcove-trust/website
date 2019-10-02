import React, { Component } from 'react';
import { Button } from '../../Components/Button';
import { Input, FormGroup, Select } from '../../Components/FormControl';
import Delete from './DetailsWidget/Delete';
import $ from 'jquery';

export default class Gallery extends Component {
    constructor(props) {
        super(props);

        this.state = {
            data: null,
            search: null,
            filter: null
        }
    }

    componentDidMount() {
        this.getData();
    }

    Filter(x) {
        var result = true;

        if (this.state.filter && x.mediaType.category != this.state.filter)
            result = false;

        if (this.state.search && !x.name.toLowerCase().includes(this.state.search.toLowerCase()))
            result = false;

        return result;
    }

    getData() {
        $.ajax({
            method: 'get',
            url: `/admin/media/data`
        }).done((mediaGallery) => {
            this.setState({
                data: mediaGallery
            });
        }).fail((err) => {
            console.error(`[Gallery@getData] Error getting data: `, err.responseText);
        })
    }

    render() {
        let media;
        if (this.state.data) {
            media = this.state.data.map((media, key) => {
                if (!this.Filter(media)) return <div key={key}/>;

                return (
                    <div className="col-md-6 col-lg-4" key={key}>
                        <Item data={media} cb={this.props.viewDetails.bind(this, media)} />
                    </div>
                )
            });
        }

        return (
            <div className="row pt-3">
                <div className="col-12">
                    <h1 className="text-center">Media Gallery</h1>
                </div>

                <div className="col-md-4 col-sm-12">
                    <FormGroup label="Search:">
                        <Input type="text"
                            placeHolder="File Name..."
                            value={this.state.search}
                            cb={(search) => this.setState({ search })}
                        />
                    </FormGroup>
                </div>

                <div className="col-md-4 col-sm-12">
                    <FormGroup label="Type:">
                        <Select selected={this.state.filter}
                            options={["", "Audio", "Image", "File"]}
                            cb={(filter) => this.setState({ filter })}
                        />
                    </FormGroup>
                </div>

                <div className="col-md-4 col-sm-12 pb-4">
                    <Button className="btn btn-dark btn-sm float-right" cb={this.props.setTab.bind(this, 3)}>
                        Upload File <i className="fas fa-upload" />
                    </Button>
                </div>

                <hr />

                {media}
            </div>
        )
    }
}

class Item extends Component {
    render() {
        let tags = "N/A";
        if (this.props.data.tags) {
            tags = this.props.data.tags.map((text, key) => {
                return <Tag text={text} key={key}/>
            });
        }

        return (
            <div className="card border-0 mb-2 transform-on-hover">
                <img src={`/media?filename=${this.props.data.filename}`} alt={this.props.data.name} className="card-img-top" />

                <div className="card-body text-center">
                    <h6>{this.props.data.name || "untitled"}</h6>
                    <p className="text-muted card-text">{this.props.data.mediaType.value.toLowerCase() || ""}</p>

                    <div className="pb-4">
                        <hr />

                        <p>Used in:</p>
                        {tags}
                    </div>

                    <Button className="btn btn-dark btn-sm mx-1" cb={this.props.cb}>Edit</Button>
                    <Delete id={this.props.data.id} />
                </div>
            </div>
        )
    }
}

class Tag extends Component {
    render() {
        return (
            <span className="badge badge-dark p-2">{this.props.text}</span>
        )
    }
}