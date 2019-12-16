import React, { Component, Fragment } from 'react';
import ReactDOM from 'react-dom';
import { Button, BtnGroup, ConfirmButton } from '../Components/Button';
import SelectMedia from './SelectMedia';

import _ from 'lodash';

export default class Media extends Component {
    constructor(props) {
        super(props);
        this.state = {
            content: _.cloneDeep(this.props.content) || {
                filename: "",
                alt: ""
            },
            default: _.cloneDeep(this.props.content) || {
                filename: "",
                alt: ""
            }, 
            ImageAspect: null,
            Height: 1,
            Width: 1,
            showModal: false
        }

        this.onImageLoad = this.onImageLoad.bind(this);
        this.contentRef = React.createRef();
    }

    componentDidMount() {
        this.containerSize();
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.content == this.state.default) return;

        this.setState({
            default: _.cloneDeep(nextProps.content),
            content: _.cloneDeep(nextProps.content)
        });
    }

    // Determine the dimensions of the original image from the server
    onImageLoad({target:img}) {
        this.setState({
            ImageAspect: img.naturalHeight / img.naturalWidth
        });
    }

    containerSize() {
        let component = ReactDOM.findDOMNode(this.contentRef.current).getBoundingClientRect();

        if (component.width > this.state.Width || component.Height > this.state.height) {
            let Width = Math.trunc(Math.round(component.width));
            let Height = Math.trunc(Math.round(component.height));

            this.setState({
                Width, Height
            });
        }
    }

    handleClearImage() {
        let content = {
            imageMediaId: null,
            slotNo: this.state.default.slotNo
        };
        this.setState({
            content
        }, () => {
            this.pushChanges();
        });
    }

    handleImageSelect(file) {
        file.slotNo = this.state.default.slotNo;
        file.imageMediaId = file.id;
        this.setState({
            showModal: false,
            content: file
        });
    }

    ImageUrl() {
        if (!this.state.content) return;

        let defaultUrl = `https://via.placeholder.com/${this.state.Width}x${this.state.Height}?text=Media%20Component%20Placeholder`;
        return this.state.content && this.state.content.filename ? `/media?filename=${this.state.content.filename}&width=${this.state.Width}` : defaultUrl;
    }

    pushChanges() {
        this.setState({
            showModal: false
        }, () => {
            this.props.pushChanges(this.state.content);
            this.reset();
        });
    }

    toggleModal(visible) {
        this.setState({
            showModal: visible
        });
    }

    reset() {
        this.setState({
            content: _.cloneDeep(this.state.default)
        });
    }

    render() {
        let selectFile = this.props.allowEdits && JSON.stringify(this.state.content) == JSON.stringify(this.state.default) ? (
            <Fragment>
                <BtnGroup className="d-block text-right float-right-above">
                    <ConfirmButton className="btn btn-danger btn-sm" cb={this.handleClearImage.bind(this)}>
                        Clear <i className="far fa-times"/>
                    </ConfirmButton>
                    <Button className="btn btn-dark btn-sm" style={{ 'bottom': '0px' }} cb={this.toggleModal.bind(this, true)}>
                        Select Image <i className="far fa-images" />
                    </Button>
                </BtnGroup>

                <SelectMedia type="Image"
                    showModal={this.state.showModal}
                    cb={this.handleImageSelect.bind(this)}
                    handleHideModal={() => {
                        this.toggleModal(false)
                    }}
                />
            </Fragment>
        ) : this.props.allowEdits ? (
                <BtnGroup className="d-block text-right float-right-above">
                    <Button className="btn btn-dark btn-sm" cb={this.reset.bind(this)}>
                        Undo <i className="fas fa-undo" />
                    </Button>

                    <Button className="btn btn-info border-dark btn-sm" cb={this.pushChanges.bind(this)}>
                        <i className="fas fa-check" />
                    </Button>
                </BtnGroup>
        ) : null

        // If we are not in edit mode, and no image exists then hide the image.
        let image = !this.props.allowEdits && !this.state.content.filename ? null : (
            <img onLoad={this.onImageLoad}
                src={this.ImageUrl()}
                alt={this.state.content ? this.state.content.alt : ""}
                style={{
                    'position': 'absolute',
                    'objectFit': 'cover',
                    'width': '100%',
                    'height': '100%',
                    'top': '0px',
                    'left': '0px'
                }}
            />
        )

        let calculatedHeight = this.state.ImageAspect != null ? this.state.ImageAspect * this.state.Width : null;

        return (
            <div style={{ 'position': 'relative', 'minHeight': calculatedHeight || this.props.minHeight }} ref={this.contentRef} >
                {image}
                {selectFile}
            </div>
        )
    }
}