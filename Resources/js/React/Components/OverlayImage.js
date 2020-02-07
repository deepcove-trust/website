import React, { Component } from 'react';
import { Button } from './Button';

/*
 * Image that will show an overlaid button when hovered over
 * 
 * Props:
 * enabled: Enabled on-hover effect
 * imageSource: Url of image to be displayed
 * cb: Onclick callback
 * forceSquare: Will force the image to be square, using cover
 * */

export default class OverlayImage extends Component {
    render() {

        let onClick = this.props.enabled ? this.props.cb : null;

        return (
            <div className={this.props.containerClass}>
                <div onClick={onClick} className={`overlay-image ${this.props.enabled ? 'overlay-image-enabled' : ''}`}>
                    <img src={this.props.imageSource} className="w-100 img-fluid object-fit-cover" />
                    <div className="overlay">
                        {this.props.children}
                    </div>
                </div>
            </div>
            )
    }
}