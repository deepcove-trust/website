import React, { Component, Fragment } from 'react';
import MapBox from './MapBox';
import { LngLatLike } from 'mapbox-gl';
import $ from 'jquery';
import { CardHighlight } from '../../../Components/Card';
import { ConfirmModal, Button } from '../../../Components/Button';
import { Input } from '../../../Components/FormControl';

const url = '/admin/app/tracks';

export default class TrackDetails extends Component {

    constructor(props) {
        super(props);
        this.state = {
            editTrackMode: false,
            addActivityMode: false,
            trackName: this.props.trackName,
            track: null,
        }
    }

    componentDidMount() {
        this.getData();
    }

    getData() {
        $.ajax({
            type: 'get',
            url: `${url}/${this.props.trackId}`
        }).done((track) => {
            this.setState({
                track
            });
        }).fail((error) => {
            this.props.alert.error(null, error.responseText);
            this.props.onBack();
        });
    }

    onMapClick(lngLat) {

        console.log(lngLat);

        // Add new activity if we are in add activity mode
        if (this.state.addActivityMode) {
            // Add activity
        }                
    }

    onNameChange(e) {
        e.preventDefault();

        $.ajax({
            type: 'patch',
            url: `${url}/${this.props.trackId}`,
            data: { name: this.state.trackName  }
        }).done(() => {
            this.props.alert.success("Track updated!");
            this.setState({
                editTrackMode: false
            });
        }).fail((error) => {
            this.props.alert.error(null, error.responseText);
            this.setState({
                editTrackMode: false,
                trackName: this.props.trackName
            });
        })
    }

    render() {
        let title = !this.state.editTrackMode
            ? <div><h3 className="mt-4 mb-3 d-inline-block">{this.state.trackName}</h3><i className="fas fa-pen ml-3 pointer" onClick={() => this.setState({ editTrackMode: true })}></i></div>
            : (
                <form onSubmit={(e) => this.onNameChange(e)}>
                    <Input inputClass="d-inline-block my-3 w-30 align-left-sm" type="text" cb={(val) => this.setState({ trackName: val })} value={this.state.trackName} required />
                    <Button className="btn btn-inline btn-sm btn-success ml-3" type="submit"><i className="fas fa-check"></i></Button>
                </form>
            );

        let activities = this.state.track ? this.state.track.activities : null;
        let boundingBox = this.state.track ? this.state.track.boundingBox : null;

        return (
            <div>
                <h5 className="p-link mt-3" onClick={this.props.onBack.bind(this)}>Back to guided walks</h5>
                <CardHighlight className="position-relative py-1 px-3 mb-0 align-left-sm">
                    {title}
                    <ConfirmModal className="btn btn-dark pos-top-right" question="Delete this track" confirmPhrase={this.props.trackName}>
                        <i className="fas fa-trash"></i>                        
                        <span>&nbsp; Delete Track</span> 
                    </ConfirmModal>
                </CardHighlight>
                <div className="map-container">
                    <LoadingBox loading={this.state.track == null} />
                    <MapBox onMapClick={this.onMapClick.bind(this)} activities={activities} bbox={boundingBox} />
                </div>
                <CardHighlight className="py-1 mt-0 mb-3">
                    <h6 className="mt-2 mb-1">Drag to reposition, click to view details</h6>
                </CardHighlight>
            </div>
        )
    }
}

class LoadingBox extends Component {

    render() {
        return (
            <div className={`loading-track ${this.props.loading ? '' : 'loading-track-loaded'}`}>
                <i className="fas fa-spinner fa-spin fa-2x"></i>
            </div>
        );
    }
}