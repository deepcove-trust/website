import React, { Component, Fragment } from 'react';
import $ from 'jquery';

import { Button } from '../../../../Components/Button';
import SelectMedia from '../../../../CMS-Blocks/SelectMedia';
 
export default class EntryImages extends Component {

    constructor(props) {
        super(props);

        this.state = {
            showModal: false,
            selectedImageId: 0            
        }
    }

    // Make new image button square
    componentDidMount() {
        let el = $(".new-image-card");
        el.css("minHeight", el[0].offsetWidth);
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

    setModalVisibility(showModal) {
        this.setState({
            showModal
        });
    }

    render() {

        let imageCards = [];

        let nonSquareWarning = this.props.showWarning ? <small className="text-danger text-center mb-2 font-weight-bold">Some images are not square. This may cause unpredictable display on certain devices.</small>  : null;

        if (this.props.images) {
            imageCards = this.props.images.map(image =>
                <ImageCard key={image.id}
                    onClick={this.onImageSelect.bind(this, image.id)}
                    image={image}
                    mainImageId={this.props.mainImageId}
                    selected={image.id == this.state.selectedImageId} />
            );
        }

        imageCards.push(<NewImageCard key="0" onClick={this.setModalVisibility.bind(this, true)} />)

        return (
            <div className="card mt-3">
                <div className="bground-primary pt-3 text-white text-center"><h5>Gallery Images</h5></div>
                <div className="row p-3">
                    {imageCards}
                </div>

                <hr />

                {nonSquareWarning}

                <ImageControls disabled={this.state.selectedImageId == 0} onSetMain={this.props.onSetMain.bind(this, this.state.selectedImageId)} onRemove={this.props.onRemove.bind(this, this.state.selectedImageId)} />

                <SelectMedia type="Image"
                    showModal={this.state.showModal}
                    cb={(imageData) => this.props.onAdd(imageData)}
                    handleHideModal={() => {
                        this.setModalVisibility(false)
                    }}
                />

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
                <div id="new-image-card" className="new-image-card card" onClick={this.props.onClick}>
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