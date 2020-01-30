import React, { Component, Fragment } from 'react';
import $ from 'jquery';

export default class FactFilePreview extends Component {
    render(){
        return this.props.previewEntry
            ? <FactFileEntryPreview entry={this.props.previewEntry} />
            : <FactFileIndexPreview entries={this.props.entries} onEntrySelect={this.props.onEntrySelect.bind(this)}/>
    }
}

class FactFileIndexPreview extends Component {   

    render() {

        let entryTiles = this.props.entries.filter(entry => entry.active).map(entry => {
            return <EntryCard key={entry.id} title={entry.primaryName} imgSrc={entry.filename} onEntrySelect={this.props.onEntrySelect.bind(this, entry.id)} />
        })

        return (
            <div className="h-100">
                <div className="tab-bar"></div>
                <div className="row preview-body">
                    {entryTiles}
                </div>
                <div className="nav-bar"></div>
            </div>
        )
    }

}

class EntryCard extends Component {

    componentDidMount() {
        let el1 = $('.tile');
        el1.css("minHeight", el1[0].offsetWidth);

        let el2 = $('.object-fit-cover');
        el2.css("minHeight", el1[0].offsetWidth);
    }

    render() {
        return (
            <div className="col-6" onClick={this.props.onEntrySelect.bind(this)}>
                <div className="tile tile-shadow m-2">
                    <img className="object-fit-cover img-fluid" src={`/media?filename=${this.props.imgSrc}`} />
                    <div className="tile-title-dark mb-2">
                        {this.props.title}
                    </div>
                </div>
                
            </div>
            )
    }
}

class FactFileEntryPreview extends Component {
    render() {
        return (
            <div className="h-100">
                <div className="preview-body">
                    <div>
                        <div className="">
                            <i className=""></i>
                        </div>
                        <GalleryCarousel images={this.props.entry.images.map(image => image.filename)} />
                    </div>
                </div>
                <div className="back-button-bar"></div>
            </div>
        )
    }
}

class GalleryCarousel extends Component {

    componentDidMount() {
        $('#galleryCarousel').carousel();

        let el =$('.carousel-inner img');
        el.css("minHeight", el[0].offsetWidth);
    }

    render() {

        let images = this.props.images.map((image, index) => {
            return (
                <div key={image} className={`carousel-item ${index == 0 ? "active" : ""}`}>
                    <img className="d-block img-fluid w-100" src={`/media?filename=${image}`} />
                </div>
            )
        })

        let indicators = this.props.images.map((image, index) => {
            return (
                <li key={image} data-target="#galleryCarousel" data-slide-to={index} className={index == 0 ? "active" : ""}></li>
                )
        })

        return (
            <div>
                <div id="galleryCarousel" className="carousel slide" data-ride="carousel">
                    <ol className="carousel-indicators custom-carousel-indicators">
                        {indicators}
                    </ol>
                    <div className="carousel-inner">
                        {images}
                    </div>
                </div>
            </div>
        )
    }
}