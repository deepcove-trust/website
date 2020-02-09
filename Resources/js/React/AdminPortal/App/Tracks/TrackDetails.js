import React, { Component, Fragment } from 'react';
import MapBox from './MapBox';
import { LngLatLike } from 'mapbox-gl';
import $ from 'jquery';
import Card, { CardHighlight, CardBody } from '../../../Components/Card';
import { ConfirmModal, Button, ConfirmButton } from '../../../Components/Button';
import { Input, FormGroup, Select } from '../../../Components/FormControl';
import ActivityPreview from './ActivityPreview';
import DevicePreview from '../../../Components/DevicePreview';

const url = '/admin/app/tracks';
const typeLabels = ['Fact File', 'Count Activity', 'Photograph Activity', 'Picture Select Activity', 'Picture Tap Activity', 'Text Answer Activity'];

export default class TrackDetails extends Component {

    constructor(props) {
        super(props);
        this.state = {
            editTrackMode: false,
            addActivityMode: false,
            selectedActivityId: null,
            trackName: this.props.trackName,
            track: null,
            activity: null,
            activityChanged: false,
            factFiles: null
        }
    }

    componentDidMount() {
        this.getTrackData();
    }

    componentDidUpdate(prevProps, prevState) {

        // Load new activity data if activity has changed
        if (prevState.selectedActivityId != this.state.selectedActivityId) {
            this.getActivityData();
        }
    }

    getSelectedActivityIndex() {
        return this.state.track ? this.state.track.activities.findIndex(a => a.id == this.state.selectedActivityId) : null;
    }

    getSelectedActivity() {
        return this.state.track ? this.state.track.activities[this.getSelectedActivityIndex()] : null;
    }

    updateActivityField(key, val) {
        let activity = this.state.activity;
        activity[key] = val;
        this.setState({
            activityChanged: true,
            activity
        });
    }

    getActivityData() {
        if (!this.state.selectedActivityId) return;

        $.ajax({
            type: 'get',
            url: `${url}/${this.props.trackId}/activities/${this.state.selectedActivityId}`
        }).done(activity => {
            this.setState({
                activity,
                activityChanged: false
            });
        }).fail(error => {
            this.props.alert.error(null, error.responseText);
            this.setState({
                selectedActivityId: null
            });
        })
    }

    getTrackData(selectedActivityId) {
        $.ajax({
            type: 'get',
            url: `${url}/${this.props.trackId}`
        }).done((track) => {
            this.setState({
                track,
                activityChanged: false,
                addActivityMode: false,
                selectedActivityId
            }, () => {
                    this.getActivityData();
            });
        }).fail((error) => {
            this.props.alert.error(null, error.responseText);
            this.props.onBack();
        });

        // Also load in factfiles list
        $.ajax({
            type: 'get',
            url: "/admin/app/factfiles/entries/all"
        }).done(factFiles => {
            this.setState({
                factFiles
            });
        }).fail(error => {
            this.props.alert.error(null, error.responseText);
            this.props.onBack();
        });
    }

    onMapClick(lngLat) {        
        if (this.state.addActivityMode) {
            $.ajax({
                type: 'post',
                url: `${url}/${this.props.trackId}/activities`,
                data: {
                    lng: lngLat.lng,
                    lat: lngLat.lat
                }
            }).done(newId => {
                this.props.alert.success("New activity created!");
                this.getTrackData(newId);
            }).fail(error => {
                this.props.alert.error(null, error.responseText);
                this.setState({
                    addActivityMode: false
                });
            });
        }
    }

    onMarkerClick(selectedActivityId) {
        this.setState({
            selectedActivityId
        });
    }

    onMarkerDrop(index, lngLat) {
        $.ajax({
            type: 'patch',
            url: `${url}/${this.props.trackId}/activities/${this.state.track.activities[index].id}/position`,
            data: {
                lng: lngLat.lng,
                lat: lngLat.lat
            }
        }).done(() => {
            this.props.alert.success(`Position updated for: ${this.state.track.activities[index].title}`);
            this.getTrackData(this.state.track.activities[index].id);
        }).fail(error => {
            this.props.alert.error(null, error.responseText);
        })
    }

    onToggleActivity() {
        $.ajax({
            type: 'patch',
            url: `${url}/${this.props.trackId}/activities/${this.state.activity.id}/toggle`
        }).done((status) => {
            this.props.alert.success(`Activity ${status ? 'enabled' : 'disabled'}`);
            this.getTrackData(this.state.activity.id);
        }).fail(error => {
            this.props.alert.error(null, error.responseText);
            this.getTrackData(this.state.activity.id);
        });
    }

    onToggleTrack() {
        $.ajax({
            type: 'patch',
            url: `${url}/${this.props.trackId}/toggle`
        }).done(status => {
            this.props.alert.success(status ? 'Track enabled!' : 'Track disabled');
            this.getTrackData(this.state.activity ? this.state.activity.id : null);
        }).fail(error => {
            this.props.alert.error(null, error.responseText);
        });
    }

    onSaveActivity(e) {
        e.preventDefault();

        // Perform state validation here

        // Make the request
        $.ajax({
            type: 'put',
            url: `${url}/${this.props.trackId}/activities/${this.state.activity}`,
            contentType: 'application/json',
            data: JSON.stringify(this.state.activity)
        }).done(() => {
            this.props.alert.success("Activity Updated!");
            this.getActivityData();
        }).fail(error => {
            this.props.alert.error(null, error.responseText);
            this.getTrackData(this.state.activity.id);
        });
    }

    onDeleteActivity(activityId) {
        $.ajax({
            type: 'delete',
            url: `${url}/${this.props.trackId}/activities/${this.state.activity.id}`
        }).done(() => {
            this.props.alert.success("Activity Deleted!");
            this.getTrackData();
        }).fail(error => {
            this.props.alert.error(null, error.responseText);
        });
    }

    onDeleteTrack() {
        $.ajax({
            type: 'delete',
            url: `${url}/${this.props.trackId}`
        }).done(() => {
            this.props.alert.success("Track Deleted!");
            this.props.onBack();
        }).fail(error => {
            this.props.alert.error(null, error.responseText);
        });
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

    onFormSubmit(e) {
        e.preventDefault();

        // Update the activity
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

        // Make it super clear that they click to add a new activity
        let addPendingNotice = !this.state.addActivityMode ? null : (
            <div className="click-to-add">
                <h4>Click to add a new activity</h4>
            </div>
        )    

        let trackStatus = this.state.track ? (
            <div className="bground-faded text-center p-4">
                <p className={`mt-3 mb-2 font-weight-bold d-inline ${this.state.track.active ? 'text-success' : 'text-danger'}`}>
                    {!this.state.track.active
                        ? 'This track is DISABLED. It will not appear in the app.'
                        : 'This track is ENABLED. It will appear in the app.'}
                </p>
                <Button className="btn-dark ml-3" cb={this.onToggleTrack.bind(this)}>{this.state.track.active ? 'Disable' : 'Enable'}</Button>
            </div>
            ) : null;

        return (
            <div>
                <h5 className="p-link mt-3" onClick={this.props.onBack.bind(this)}>Back to guided walks</h5>
                <CardHighlight className="position-relative py-1 px-3 mb-0 align-left-sm">
                    {title}
                    <ConfirmModal className="btn btn-dark pos-top-right" cb={this.onDeleteTrack.bind(this)} question="Delete this track" confirmPhrase={this.props.trackName}>
                        <i className="fas fa-trash"></i>                        
                        <span>&nbsp; Delete Track</span> 
                    </ConfirmModal>
                </CardHighlight>
                {trackStatus}
                <div className="map-container">
                    <LoadingBox loading={this.state.track == null} />
                    <MapBox onMapClick={this.onMapClick.bind(this)} onMarkerDrop={this.onMarkerDrop.bind(this)} onMarkerClick={this.onMarkerClick.bind(this)} activities={activities} bbox={boundingBox} selectedActivityId={this.state.selectedActivityId} />
                    <AddActivityButton onClick={() => this.setState({ addActivityMode: !this.state.addActivityMode })} addEnabled={this.state.addActivityMode} />
                    {addPendingNotice}
                </div>
                <CardHighlight className="py-1 mt-0 mb-3">
                    <h6 className="mt-2 mb-1">Drag to reposition, click to view details</h6>
                </CardHighlight>

                <div className="row">
                    <div className="col-lg-7">
                        <ActivityDetails activity={this.state.activity}
                            trackStatus={this.state.track ? this.state.track.active : null}
                            onSave={this.onSaveActivity.bind(this)}
                            onDelete={this.onDeleteActivity.bind(this)}
                            toggleActivity={this.onToggleActivity.bind(this)}
                            factFiles={this.state.factFiles}
                            updateField={this.updateActivityField.bind(this)} />
                    </div>
                    <div className="col-lg-5 show-large">
                        <div className="m-3 sticky-preview show-large text-center">
                            <DevicePreview sticky topBarGreen>
                                <ActivityPreview activity={this.getSelectedActivity()} />
                            </DevicePreview>
                        </div>
                    </div>
                </div>

                <div className={`text-center control-buttons ${this.state.activityChanged ? 'control-buttons-show' : ''}`}>
                    <ConfirmButton className="btn btn-danger" cb={() => { this.getTrackData(this.state.activity.id)}}>Discard Changes</ConfirmButton>
                    <ConfirmButton className="btn btn-success m-1 mr-3" cb={() => { $('#activity-form').submit() }}>Save Changes</ConfirmButton>
                </div>
                
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

class AddActivityButton extends Component {
    render() {
        let content = this.props.addEnabled
            ? (
                <Fragment>
                    <span>Cancel</span>
                    <i className="fas fa-times ml-3"></i>
                </Fragment>
            ) : (
                <Fragment>
                    <span>Add</span>
                    <i className="fas fa-plus ml-3"></i>
                </Fragment>
            );

        return (
            <Button className={`btn pos-top-right ${this.props.addEnabled ? 'btn-danger' : 'btn-success'}`}
                cb={this.props.onClick.bind(this, !this.props.addEnabled)}>{content}</Button>
            )
    }
}

class ActivityDetails extends Component {
    render() {        

        if (!this.props.activity || !this.props.factFiles) {
            return (
                <div className="h-100 w-100">
                    <h3 className="card bground-primary text-white w-100 mt-2 mt-lg-5 pt-4 pb-3 text-center">
                        Select an activity on the map to edit
                    </h3>
                </div>
            );
        }     

        let activityActive = this.props.activity.active;
        let trackActive = this.props.trackStatus;

        let activeStatus = this.props.activity && this.props.trackStatus != null ? (
            <div className="text-center p-3 mb-3 card bground-faded">
                <p className={`${trackActive && activityActive ? 'text-success' : activityActive ? 'text-orange' : 'text-danger'} font-weight-bold`}>
                    {activityActive && trackActive
                        ? 'This activity is active. It will show on the app.'
                        : activityActive
                            ? 'This activity is active, but the track it belongs to is disabled. It will not appear in the app'
                            : 'This activity is inactive. It will not show on the app.'}
                </p>
                <Button cb={this.props.toggleActivity.bind(this)} className="btn btn-dark btn-sm">{this.props.activity.active ? 'Disable Activity' : 'Enable Activity'}</Button>
            </div>
        ): null;

        let activityType = typeLabels[this.props.activity.activityType];

        let factFileOptions = this.props.factFiles.map((entry) => {
            return <option key={entry.id} value={entry.id}>{entry.primaryName}</option>
        });

        factFileOptions.unshift((
            <option key="0" value={null}>-- No factfile --</option>
        ));

        let typeOptions = typeLabels.map((type, index) => {
            return <option key={index} value={index}>{type}</option>
        });        

        // Title field doesn't appear for informational activity
        let title =  (
            <FormGroup htmlFor="activity-title" label="Activity Title" required>
                <Input id="activity-title" type="text" value={this.props.activity.title} cb={this.props.updateField.bind(this, 'title')} required />
            </FormGroup>
        );

        let factFile = (
            <FormGroup htmlFor="fact-file-id" label="Linked Fact File" required>
                <Select id="fact-file-id" formattedOptions={factFileOptions}
                    cb={this.props.updateField.bind(this, 'activityType')}
                    selected={this.props.activity.factFile ? this.props.activity.factFile.id : null} required />
            </FormGroup>
            )

        return (
            <Card className="mt-2 mt-lg-5">
                <CardHighlight className="position-relative">
                    <h5 className="mt-4 mb-3 ml-3 text-left">{this.props.activity.title}</h5>
                    <ConfirmButton className="btn btn-dark pos-top-right" cb={this.props.onDelete}>
                        <i className="fas fa-trash"></i>
                        &nbsp; Delete Activity
                    </ConfirmButton>
                </CardHighlight>
                
                <CardBody>

                    {activeStatus}

                    <form id="activity-form" onSubmit={(e) => { this.props.onSave(e) }}>                           
                        <FormGroup htmlFor="activity-type" label="Activity Type:" required>
                            <Select formattedOptions={typeOptions} selected={this.props.activity.activityType} cb={this.props.updateField.bind(this, 'activityType')} required />
                        </FormGroup>
                        {title}
                        {factFile}
                    </form>
                </CardBody>
            </Card>
            )
    }
}

            