import React, { Component } from 'react';

export default class EntryAudio extends Component {
    render() {
        return (
            <div className="card mt-3">
                <div className="bground-primary pt-3 text-white text-center"><h5>Audio Clips</h5></div>
                <div className="p-3">
                    <div className="row">
                        <div className="col-md-6">
                            Listen Audio &nbsp;
                        <label htmlFor="listenAudioFile" className="btn btn-dark">Select</label>
                            <input className="d-none" type="file" name="listenAudioFile" id="listenAudioFile" />

                        </div>
                        <div className="col-md-6">
                            Pronounce Audio &nbsp;
                        <label htmlFor="pronounceAudioFile" className="btn btn-dark">Select</label>
                            <input className="d-none" type="file" name="pronounceAudioFile" id="pronounceAudioFile" />
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}