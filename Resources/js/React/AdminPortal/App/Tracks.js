import React, { Component, Fragment } from 'react';
import { render } from 'react-dom';
import TrackIndex from 'TrackIndex';
import TrackDetails from 'TrackDetails';
import ErrorBoundary from 'ErrorBoundary';
import Alert from 'Alert';

export default class Tracks extends Component {

    constructor(props) {
        super(props);
        this.state = {
            selectedTrackId: null,
            selectedTrackName: null
        };
    }

    // Ensure that the alert ref is passed to children
    componentDidMount() {
        this.setState({
        });
    }

    onSelect(selectedTrackId, selectedTrackName) {
        this.setState({
            selectedTrackId,
            selectedTrackName
        });
    }

    onBack() {
        this.setState({
            selectedTrackId: null
        });
    }    

    render() {
        let page = this.state.selectedTrackId
            ? <TrackDetails alert={this.Alert} onBack={this.onBack.bind(this)} trackName={this.state.selectedTrackName} trackId={this.state.selectedTrackId} />
            : <TrackIndex alert={this.Alert} onSelect={this.onSelect.bind(this)} />

        return (
            <ErrorBoundary customError="react-tracks">
                <Alert onRef={ref => this.Alert = ref}>
                    <h1 className="text-center my-5">Guided Walk Management</h1>
                    {page}
                </Alert>
            </ErrorBoundary>
        );
    }
}

if (document.getElementById('react_app_tracks')) {
    render(<Tracks />, document.getElementById('react_app_tracks'));
}