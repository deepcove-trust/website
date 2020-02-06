import React, { Component } from 'react';
import { Button } from '../../Components/Button';
import { Input, FormGroup } from '../../Components/FormControl';
import Rselect from 'react-select';
import AudioControls from '../../Components/Audio';
import Delete from './DetailsWidget/Delete';
import $ from 'jquery';

const filterOptions = [
    { label: "Any", value: "" },
    { label: "Audio", value: "Audio" },
    { label: "Image", value: "Image" },
    { label: "File", value: "General"}
]

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

    componentDidUpdate() {
        // Make all tiles square
        let images = $('.media-gallery-card img');

        if (images.length > 0)
            images.css("height", images[0].offsetWidth);
    }

    handleFilterChange(filter) {
        this.setState({
            filter: filter.value
        });
    }

    render() {
        let media;
        if (this.state.data) {
            media = this.state.data.map((media, key) => {
                if (!this.Filter(media)) return null;

                return (
                    <div className="col-6 col-lg-4" key={key}>
                        <Item data={media}
                            refresh={this.getData.bind(this)}
                            cb={this.props.viewDetails.bind(this, media)}
                            alert={this.props.alert}
                        />
                    </div>
                )
            });
        }

        return (
            <div className="row pt-3">
                <div className="col-12 py-3">
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
                        <Rselect options={filterOptions}
                            onChange={this.handleFilterChange.bind(this)}
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

        let imgsrc = !this.props.data.mediaType.mime.includes('audio/') ? `/media?filename=${this.props.data.filename}` : `/images/audio.png`;       
        if (!this.props.data.mediaType.mime.includes('audio/') && !this.props.data.mediaType.mime.includes('image/')) imgsrc = `/images/document.png`;   

        return (
            <div className="card border-0 mb-3 transform-on-hover media-gallery-card">
                <img src={imgsrc} alt={this.props.data.alt} className="card-img-top gallery-img" onClick={this.props.cb}/>
                <AudioControls file={this.props.data} className="overImg" />                

                <div className="gallery-delete-container">
                    <Delete className="btn btn-danger btn-sm" id={this.props.data.id} cb={this.props.refresh} alert={this.props.alert} />
                </div>

                <div className="file-type-container">
                    <small className="mx-3 my-1 font-weight-bold">{this.props.data.mediaType.value.toUpperCase()}</small>
                </div>

                <div className="card-body text-center pt-3 pb-2" onClick={this.props.cb}>
                    <h5 className="mb-0">{this.props.data.name || "untitled"}</h5> 
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