import React, { Component } from 'react';
import $ from 'jquery';
import Card, { CardHighlight } from '../../../Components/Card';

const url = '/admin/app/tracks/data';

export default class TrackIndex extends Component {

    constructor(props) {
        super(props);

        this.state = {
            tracks: []
        }
    }

    componentDidMount() {
        this.getData();
    }

    getData() {
        $.ajax({
            type: 'get',
            url: url
        }).done((tracks) => {
            this.setState({
                tracks
            })
        }).fail((error) => {
            this.props.alert.error(null, error.responseText);
        })
    }

    render() {

        let trackCards = this.state.tracks.map((track) => {
            return <TrackCard key={track.id}
                track={track}
                onClick={this.props.onSelect.bind(this, track.id)} />
        });

        // Add the new track button to the bottom
        trackCards.push(<NewTrackCard />)

        return (
            <Card className="card px-0 col-xl-5 col-lg-6 col-md-8 mx-auto my-5">
                <CardHighlight>
                    <h3 className="pt-3 pb-2">Select Walk</h3>
                </CardHighlight>
                <div>
                    {trackCards}
                </div>
            </Card>
        )
    }
}

class TrackCard extends Component {   

    render() {

        let active = this.props.track.active;

        return (
            <div className="m-2 row track-card p-3 pointer" onClick={this.props.onClick}>
                <div className="col-7">
                    <h5>{this.props.track.name}</h5>
                    <i className="fas fa-map-marker-alt map-marker"></i> {this.props.track.activityCount} active
                    <i className="fas fa-map-marker-minus map-marker-inactive ml-3"></i> {this.props.track.disabledCount} inactive
                </div>
                <div className="col-5 text-right">
                    <small className={`font-weight-bold ${active ? 'text-success' : 'text-danger'}`}>{active ? 'ENABLED' : 'DISABLED'}</small>
                </div>
            </div>
        )
    }
}

class NewTrackCard extends Component {

    constructor(props) {
        super(props);
        this.state = {
            editMode: false
        };
    }

    render() {
        return (
            <div className="text-center m-2 py-3 new-track-card pointer" onClick={() => { this.setState({editMode: true})}}>
                <i className="far fa-plus-circle fa-3x"></i>
                <small className="d-block">Add New Track</small>
            </div>
        )
    }
}