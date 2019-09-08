import React, { Component } from 'react';
import ReactDOM from 'react-dom';

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
        return `https://via.placeholder.com/${this.state.Width}x${this.state.Height}?text=Media%20Component%20Placeholder`;
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
            </div>
        )
    }
}