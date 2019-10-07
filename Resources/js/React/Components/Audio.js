import React, { Component } from 'react';

export default class AudioControls extends Component {
    render() {
        if (!this.props.file.mediaType.mime.includes("audio/")) return <div />;

        return (
            <audio className="overImg" controls>
                <source src={`/media?filename=${this.props.file.filename}`} />
                Your browser does not support this audio player, please use
                <a href="https://www.google.com/chrome/">Google Chrome</a>,
                <a href="https://www.mozilla.org/en-US/firefox/new/">Mozilla Firefox</a>,
                <a href="https://www.opera.com/">Oprea</a>, or
                <a href="https://www.apple.com/nz/safari/">Safari</a>.
            </audio>
        )
    }
}