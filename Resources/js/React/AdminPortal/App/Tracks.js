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
            selectedTrackId: null
        };
    }

    onSelect(selectedTrackId) {
        this.setState({
            selectedTrackId
        });
    }

    onBack() {
        this.setState({
            selectedTrackId: null
        });
    }

    render() {
        let page = this.state.selectedTrackId 
            ? <TrackDetails onBack={this.onBack.bind(this)} />
            : <TrackIndex onSelect={this.onSelect.bind(this)} />

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