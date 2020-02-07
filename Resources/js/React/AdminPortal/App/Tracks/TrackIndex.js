import React, { Component } from 'react';
import $ from 'jquery';
import Card, { CardHighlight } from '../../../Components/Card';
import { Button } from '../../../Components/Button';
import { FormGroup, Input } from '../../../Components/FormControl';

const url = '/admin/app/tracks';

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
            url: `${url}/data`
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
                onClick={this.props.onSelect.bind(this, track.id, track.name)} />
        });

        // Add the new track button to the bottom
        trackCards.push(<NewTrackCard key="0" onSave={this.getData.bind(this)} alert={this.props.alert} />)

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
                    <i className="fas fa-map-marker-alt marker-red"></i> {this.props.track.activityCount} active
                    <i className="fas fa-map-marker-minus marker-grey ml-3"></i> {this.props.track.disabledCount} inactive
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
            editMode: false,
            trackName: null
        };
    }

    onCancel() {
        this.setState({
            editMode: false,
            trackName: null
        });
    }

    onSubmit(e) {
        e.preventDefault();

        $.ajax({
            type: 'post',
            url: url,
            data: {
                name: this.state.trackName
            }
        }).done(() => {
            this.props.alert.success("New track added!");
            this.setState({
                editMode: false,
                trackName: null
            })
            this.props.onSave();
        }).fail((error) => {
            this.props.alert.error(null, error.responseText);
        });
    }

    render() {

        return !this.state.editMode
            ? (
                <div className="text-center m-2 py-3 new-track-card pointer" onClick={() => { this.setState({ editMode: true }) }}>
                    <i className="far fa-plus-circle fa-3x"></i>
                    <small className="d-block">Add New Walk</small>
                </div>
            )
            : (
                <div className="text-center m-2 py-3  position-relative">
                    <form className="new-track-form" onSubmit={this.onSubmit.bind(this)}>
                        <div className="row">
                            <div className="col-3">
                                <Button className="btn btn-danger" cb={this.onCancel.bind(this)}><i className="fas fa-times"></i></Button>
                            </div>
                            <div className="col-6">
                                <FormGroup htmlFor="track-name" label="Walk Name" required>
                                    <Input id="track-name" type="text" value={this.state.trackName} cb={(val) => { this.setState({ trackName: val }) }} required />
                                </FormGroup>
                            </div>
                            <div className="col-3">
                                <Button className="btn btn-success" type="submit"><i className="fas fa-check"></i></Button>
                            </div>
                        </div>
                    </form>
                </div>
            )
    }
}