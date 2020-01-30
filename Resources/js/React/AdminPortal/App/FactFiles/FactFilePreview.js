import React, { Component, Fragment } from 'react';
import $ from 'jquery';

export default class FactFilePreview extends Component {
    render(){
        return this.props.previewEntry
            ? <FactFileEntryPreview entry={this.props.previewEntry} onBack={this.props.onBack.bind(this)} />
            : <FactFileIndexPreview entries={this.props.entries} onEntrySelect={this.props.onEntrySelect.bind(this)}/>
    }
}

class FactFileIndexPreview extends Component {   

    render() {

        let entryTiles = this.props.entries.map(entry => {
            return <EntryCard key={entry.id} active={entry.active} title={entry.primaryName} imgSrc={entry.filename} onEntrySelect={this.props.onEntrySelect.bind(this, entry.id)} />
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

    // Make tiles square and use object-fit cover
    componentDidMount() {
        let el1 = $('.tile');
        el1.css("minHeight", el1[0].offsetWidth);

        let el2 = $('.object-fit-cover');
        el2.css("minHeight", el1[0].offsetWidth);
    }

    render() {

        let disabledFlag = !this.props.active ? (
            <div className="warning-stripes">
                <p>Disabled</p>
            </div>
        ) : null;

        return (
            <div className="col-6" onClick={this.props.onEntrySelect.bind(this)}>
                <div className="tile tile-shadow">
                    {disabledFlag}
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

        let bodyParagraphs = this.props.entry.bodyText.split('\n').map((p, index) => { return <p key={index} className="text-left mx-2">{p}</p> });

        let disabledFlag = !this.props.active ? (
            <div className="warning-stripes">
                <p>Disabled</p>
            </div>
        ) : null;

        return (
            <div className={`h-100`}>
                <div className="preview-body with-back-button">
                    <div>

                        {disabledFlag}

                        <GalleryCarousel images={this.props.entry.images.map(image => image.filename)} />

                        <h3 className="mt-3">{this.props.entry.primaryName}</h3>
                        <h5 className="mb-2">{this.props.entry.altName}</h5>

                        <AudioButtons listen={this.props.entry.listenAudio} pronounce={this.props.entry.pronounceAudio} />

                        <hr />

                        <NuggetSection nuggets={this.props.entry.nuggets} />

                        {bodyParagraphs}

                    </div>
                </div>
                <div className="back-button-bar" onClick={this.props.onBack.bind(this)}>Back</div>
            </div>
        )
    }
}

class GalleryCarousel extends Component {

    componentDidMount() {
        // Initiate carousel (bootstrap does this but before the carousel exists in the DOM)
        $('#galleryCarousel').carousel();

        // Make carousel images square
        let el =$('.carousel-inner img');
        el.css("minHeight", el[0].offsetWidth);
    }

    componentDidUpdate(prevProps) {
        let activeItems = $('.carousel-item.active');
        if (activeItems.length == 0) {
            $('.carousel-item').first().addClass('active');            
        }
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

class AudioButtons extends Component {

    render() {

        let pronounceButton, listenButton;

        if (this.props.listen) listenButton = (
            <div className="audio-btn">
                <i className="fas fa-music"></i>
                Listen
            </div>
        )

        if (this.props.pronounce) pronounceButton = (
            <div className="audio-btn">
                <i className="fas fa-volume-up mb-2"></i>
                Pronounce
            </div>
        )

        return (
            <div className="d-flex flex-row justify-content-center">
                {listenButton}
                {pronounceButton}
            </div>
        )
    }
}

class NuggetSection extends Component {
    render() {

        let nuggets = this.props.nuggets.map(nugget => {
            return <NuggetCard key={nugget.id} nugget={nugget} />
        })

        return (
            <div>
                {nuggets}
            </div>
            )
    }
}

class NuggetCard extends Component {
    render() {

        let image, text;

        if (this.props.nugget.image.filename) image = (
            <div className="col-5 mx-auto">
                <img src={`/media?filename=${this.props.nugget.image.filename}`} />
            </div>
        )

        if (this.props.nugget.text || this.props.nugget.name) text = (
            <div className="col-7 mx-auto">
                <div className={`vertically-center ${this.props.nugget.image.filename ? "w-80" : ""}`}>
                    <h5 className="mx-auto">{this.props.nugget.name}</h5>
                    <p>{this.props.nugget.text}</p>
                </div>
            </div>
            )

        return (
            <Fragment>
                <div className="row preview-nugget-card">
                    {image}
                    {text}
                </div>
                <hr className="green" />
            </Fragment>
            )
    }
}