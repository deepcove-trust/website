import React, { Component } from 'react';
import { Button } from '../../Components/Button';
import $ from 'jquery';

export default class Gallery extends Component {
    constructor(props) {
        super(props);

        this.state = {
            data: null
        }
    }

    componentDidMount() {
        this.getData();
    }

    getData() {
        $.ajax({
            method: 'get',
            url: `/admin/media/data`
        }).done((mediaGallery) => {
            console.log(mediaGallery)
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
                return (
                    <div className="col-md-6 col-lg-4" key={key}>
                        <Item data={media} cb={this.props.viewDetails.bind(this, media)} />
                    </div>
                )
            });
        }

        return (
            <div className="row pt-3">
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
            <div className="card border-0 transform-on-hover">
                <img src={`/media?filename=${this.props.data.filename}`} alt={this.props.data.name} className="card-img-top" />

                <div className="card-body text-center">
                    <h6>{this.props.data.name || "untitled"}</h6>
                    <p className="text-muted card-text">{this.props.data.mediaType.value.toLowerCase() || ""}</p>

                    <div className="pb-4">
                        <hr />

                        <p>Used in:</p>
                        {tags}
                    </div>

                    <Button className="btn btn-outline-dark mx-1" cb={this.props.cb}>Edit</Button>
                    <Button className="btn btn-outline-danger mx-1" disabled>
                        Delete <i className="fas fa-trash" />
                    </Button>
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