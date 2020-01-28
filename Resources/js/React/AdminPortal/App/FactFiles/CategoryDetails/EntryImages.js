import React, { Component, Fragment } from 'react';
import $ from 'jquery';

import { Button } from '../../../../Components/Button';

export default class EntryImages extends Component {

    constructor(props) {
        super(props);

        this.state = {
            selectedImageId: 0            
        }
    }

    componentWillReceiveProps(nextProps) {
        if (this.props != nextProps) {
            this.setState({
                selectedImageId: 0
            })
        }
    }

    onImageSelect(selectedImageId) {
        this.setState({
            selectedImageId
        });
    }

    onSetMain() {

    }

    onRemove() {

    }

    render() {

        let imageCards = [];

        if (this.props.images) {
            imageCards = this.props.images.map(image =>
                <ImageCard key={image.id}
                    onClick={this.onImageSelect.bind(this, image.id)}
                    image={image}
                    mainImageId={this.props.mainImageId}
                    selected={image.id == this.state.selectedImageId} />
            );
        }

        imageCards.push(<NewImageCard key="0" />)

        return (
            <div className="card mt-3">
                <div className="bground-primary pt-3 text-white text-center"><h5>Gallery Images</h5></div>
                <div className="row p-3">
                    {imageCards}
                </div>

                <hr />

                <ImageControls disabled={this.state.selectedImageId == 0} onSetMain={this.onSetMain.bind(this)} onRemove={this.onRemove.bind(this)} />

            </div>
        )
    }
}

class ImageCard extends Component {
    render() {

        let isMainImage = this.props.image.id == this.props.mainImageId;

        let label;
        if(isMainImage) label = <p className="image-card-label">MAIN</p>

        return (
            <div className="col-lg-4 col-6 my-1">
                <div className={`${isMainImage ? "main-image-card" : ""} ${this.props.selected ? "selected-image-card" : ""} image-card card`} onClick={this.props.onClick}>
                    <img className="img-fluid" src={`/media?filename=${this.props.image.filename}`} />
                    {label}
                </div>                
            </div>
            )
    }
}

class NewImageCard extends Component {
    render() {
        return (
            <div className="col-lg-4 col-6 my-1">
                <div className="new-image-card card" onClick={this.props.onClick}>
                    <div>
                        <i className="far fa-plus-square fa-5x" />
                    </div>
                </div>
            </div>
            )
    }
}

class ImageControls extends Component {
    render() {
        return (
            <div className="p-1 mb-2 text-center image-control-buttons">
                With selected image: &nbsp;
                <div className="d-inline-block">
                    <Button className="btn btn-dark" disabled={this.props.disabled} cb={this.props.onSetMain.bind(this)}>Set as main</Button>
                    <Button className="btn btn-dark ml-1" disabled={this.props.disabled} cb={this.props.onRemove.bind(this)}>Remove</Button>
                </div>
            </div>
            )
    }
}