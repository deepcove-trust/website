﻿import React, { Component } from 'react';
import { Button } from '../../Components/Button';
import MetaData from './DetailsWidget/Metadata';
import AudioControls from '../../Components/Audio';

export default class Details extends Component {
    render() {
        let imgUrl = "/images/audio.png";
        if (!this.props.data.mediaType.mime.includes("audio/")) {
            imgUrl = `/media?filename=${this.props.data.filename}`;
        }
            
        

        return (
            <div className="row pb-5">
                <div className="col-12">
                    <h1 className="text-center">Media File Details</h1>

                    <div className="pb-4">
                        <Button className="btn btn-dark btn-sm float-left" cb={this.props.setTab.bind(this, 1)}>
                            Back to Gallery
                        </Button>
                        <Button className="btn btn-dark btn-sm float-right" cb={this.props.setTab.bind(this, 3)}>
                            Upload File <i className="fas fa-upload" />
                        </Button>
                    </div>

                    <hr />
                </div>

                
                <div className="col-md-6 col-sm-12 detials-container">
                    <img src={imgUrl} alt={this.props.data.alt} />
                    <AudioControls file={this.props.data}/>
                </div>

                <div className="col-md-6 col-sm-12">
                    <MetaData file={this.props.data}
                        deleteCb={this.props.setTab.bind(this, 1)}
                    />
                </div>
            </div>
        )
    }
}