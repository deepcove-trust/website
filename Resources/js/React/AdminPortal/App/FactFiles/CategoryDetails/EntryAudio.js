import React, { Component, Fragment } from 'react';

import SelectMedia from '../../../../CMS-Blocks/SelectMedia';
import AudioControls from '../../../../Components/Audio';
import { Button } from '../../../../Components/Button';

export default class EntryAudio extends Component {

    constructor(props) {
        super(props);

        this.state = {
            showModal: false,
            selectingFor: null  // should be listenAudio or pronounceAudio
        }
    }

    showModal(showModal, selectingFor = null) {
        this.setState({
            showModal,
            selectingFor
        })
    }    

    render() {
        return (
            <div className="card mt-3">
                <div className="bground-primary pt-3 text-white text-center"><h5>Audio Clips</h5></div>
                <div className="p-3">
                    <div className="row">
                        <div className="col-md-6">
                            <AudioCard file={this.props.listenFile} title="Listen Audio" onAdd={this.showModal.bind(this, true, "listenAudio")} onRemove={this.props.onRemove.bind(this, "listenAudio")}/>
                        </div>
                        <div className="col-md-6">
                            <AudioCard file={this.props.pronounceFile} title="Pronounce Audio" onAdd={this.showModal.bind(this, true, "pronounceAudio")} onRemove={this.props.onRemove.bind(this, "pronounceAudio")} />
                        </div>
                    </div>

                    <SelectMedia
                        type="Audio"
                        showModal={this.state.showModal}
                        cb={(audioData) => this.props.onAdd(audioData, this.state.selectingFor)}
                        handleHideModal={() => {
                            this.showModal(false)
                        }}
                    />

                </div>
            </div>
        )
    }
}

class AudioCard extends Component {
    render() {

        let content;
        if (!this.props.file) {
            content = (
                <div className="new-audio-card" onClick={this.props.onAdd.bind(this)}>
                    <i className="far fa-plus-square fa-3x"></i>
                </div>
            )
        }
        else content = (
            <Fragment>
                <div>
                    <span>{this.props.file.name}</span>
                    <Button className="btn btn-gray d-inline-block" cb={this.props.onRemove.bind(this)}><i className="fas fa-times"></i></Button>
                </div>
                <AudioControls className="mx-auto w-100" file={this.props.file} />
            </Fragment>
        )

        return (

            <div className="card text-center h-100 p-3 mt-2">
                <h5>{this.props.title}</h5>
                {content}
            </div>

        )
    }
}