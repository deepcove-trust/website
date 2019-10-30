import React, { Component, Fragment } from 'react';
import ReactDOM from 'react-dom';
import { Button, BtnGroup } from '../Components/Button';
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
            Height: 1,
            Width: 1,
            showModal: false
        }

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
                <Button className="btn btn-dark btn-sm float-right-down" style={{ 'bottom': '0px' }} cb={this.toggleModal.bind(this, true)}>
                    Select Image <i className="far fa-images" />
                </Button>

                <SelectMedia type="Image"
                    showModal={this.state.showModal}
                    cb={this.handleImageSelect.bind(this)}
                    handleHideModal={() => {
                        this.toggleModal(false)
                    }}
                />
            </Fragment>
        ) : this.props.allowEdits ? (
                <BtnGroup className="d-block text-right float-right-down">
                    <Button className="btn btn-dark btn-sm" cb={this.reset.bind(this)}>
                        Undo <i className="fas fa-undo" />
                    </Button>

                    <Button className="btn btn-info border-dark btn-sm" cb={this.pushChanges.bind(this)}>
                        <i className="fas fa-check" />
                    </Button>
                </BtnGroup>
        ) : null


        return (
            <div style={{ 'position': 'relative', 'minHeight': this.props.minSize || '250px' }}
                ref={this.contentRef} >

                <img src={this.ImageUrl()}
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
                
                {selectFile}
            </div>
        )
    }
}