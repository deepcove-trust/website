import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Button } from '../Components/Button';
import SelectMedia from './SelectMedia';

export default class Media extends Component {
    constructor(props) {
        super(props);

        this.state = {
            Height: 1,
            Width: 1
        }

        this.contentRef = React.createRef();
    }

    componentDidMount() {
        this.containerSize();
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

    ImageUrl() {
        let defaultUrl = `https://via.placeholder.com/${this.state.Width}x${this.state.Height}?text=Media%20Component%20Placeholder`;

        return this.props.file ? `/media?filename=${this.props.file.filename}&width=${this.state.Width}` : defaultUrl;
    }

    toggleModal(visible) {
        console.log(visible)
        this.setState({
            showModal: visible
        });
    }

    render() {
        return (
            <div style={{ 'position': 'relative', 'minHeight': this.props.minSize || '250px' }}
                ref={this.contentRef} >

                <img src={this.ImageUrl()}
                    style={{
                        'position': 'absolute',
                        'width': '100%',
                        'top': '0px',
                        'left': '0px'
                    }}
                />
                
                <Button className="btn btn-dark btn-sm float-right-down" style={{ 'bottom': '0px' }} cb={this.toggleModal.bind(this, true)}>
                    Select Image <i className="far fa-images"/>
                </Button>

                <SelectMedia type="Image"
                    showModal={this.state.showModal}
                    cb={(id) => console.log(`selected item id: ${id}`)}
                    handleHideModal={() => {
                        this.toggleModal(false)
                    }}
                />
            </div>
        )
    }
}