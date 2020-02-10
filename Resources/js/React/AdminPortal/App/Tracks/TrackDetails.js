import React, { Component, Fragment } from 'react';
import MapBox from './MapBox';
import $ from 'jquery';
import Card, { CardHighlight, CardBody } from '../../../Components/Card';
import { ConfirmModal, Button, ConfirmButton } from '../../../Components/Button';
import { Input, FormGroup, Select, TextArea } from '../../../Components/FormControl';
import ActivityPreview from './ActivityPreview';
import SelectMedia from '../../../CMS-Blocks/SelectMedia';

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

    updateActivityField(key, val) {
        let activity = this.state.activity;

        if (key == 'factFile') val = this.state.factFiles.find(f => f.id == val);

        if (key == 'activityType' && val == 'Picture Select Activity') activity.images = activity.images || [null, null, null];

        activity[key] = val;
        this.setState({
            activityChanged: true,
            activity
        });
    }

    getActivityData() {
        if (!this.state.selectedActivityId) return this.setState({activity: null});

        $.ajax({
            type: 'get',
            url: `${url}/${this.props.trackId}/activities/${this.state.selectedActivityId}`
        }).done(activity => {
            this.setState({
                activity,
                activityChanged: false,
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
        let activity = this.state.activity;

        // Just gonna let server side handle the validation... mostly
        if (!activity.factFile && activity.activityType == 0)
            return this.props.alert.error("You must select a fact file to link this activity to.");

        // Format for the API        
        activity.factfileId = activity.factFile ? activity.factFile.id : null;
        activity.imageId = activity.image ? activity.image.id : null;
        activity.images = activity.images.map(image => image.id);
        activity.title = activity.activityType != 0 ? activity.title : activity.factFile.primaryName;

        // Make the request
        $.ajax({
            type: 'put',
            url: `${url}/${this.props.trackId}/activities/${this.state.activity.id}`,
            contentType: 'application/json',
            data: JSON.stringify(this.state.activity)
        }).done(() => {
            this.props.alert.success("Activity Updated!");
            this.getTrackData(this.state.activity.id);
        }).fail(error => {
            this.props.alert.error(null, error.responseText);
        });
    }

    onDeleteActivity() {
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

    render() {

        let noSelect =
            (!this.state.selectedActivityId || !this.state.factFiles) ?
                (
                    <div className="h-100 w-100">
                        <h3 className="card bground-primary text-white w-100 mt-1 pt-4 pb-3 text-center">
                            Select an activity on the map to edit
                    </h3>
                    </div>
                ) : null;


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
                        ? 'This walk is DISABLED. It will not appear in the app.'
                        : 'This walk is ENABLED. It will appear in the app.'}
                </p>
                <Button className="btn-dark ml-3 mt-2" cb={this.onToggleTrack.bind(this)}>{this.state.track.active ? 'Disable' : 'Enable'}</Button>
            </div>
            ) : null;

        return (
            <div>
                <h5 className="p-link mt-3" onClick={this.props.onBack.bind(this)}>Back to guided walks</h5>
                <CardHighlight className="position-relative py-1 px-3 mb-0 align-left-sm">
                    {title}
                    <ConfirmModal className="btn btn-dark pos-top-right" cb={this.onDeleteTrack.bind(this)} question="Delete this walk" confirmPhrase={this.props.trackName}>
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
                    <h6 className="mt-2 mb-1">Click marker to view activity details. After selecting, drag to reposition</h6>
                </CardHighlight>

                {   noSelect ||
                    (
                    <div className="row">
                        <div className="col-lg-7">
                            <ActivityDetails activity={this.state.activity}
                                trackStatus={this.state.track ? this.state.track.active : null}
                                onSave={this.onSaveActivity.bind(this)}
                                onDelete={this.onDeleteActivity.bind(this)}
                                toggleActivity={this.onToggleActivity.bind(this)}
                                factFiles={this.state.factFiles}
                                updateField={this.updateActivityField.bind(this)}
                            />
                        </div>
                        <div className="col-lg-5 show-large">
                            <div className="m-3 sticky-preview show-large text-center">
                                <ActivityPreview alert={this.props.alert} activity={this.state.activity} />                                
                            </div>
                        </div>
                    </div>
                    )
                }

                <div className={`text-center control-buttons ${this.state.activityChanged ? 'control-buttons-show' : ''}`}>
                    <ConfirmButton className="btn btn-danger" cb={() => { this.getTrackData(this.state.activity.id)}}>Discard Changes</ConfirmButton>
                    <Button className="btn btn-success m-1 mr-3" cb={() => { }} type="submit" form="activity-form">Save Changes</Button>
                </div>
                
            </div>
        )
    }
}

class LoadingBox extends Component {

    componentDidUpdate(prevProps) {
        if(prevProps.loading && !this.props.loading)
        setTimeout(() => {
            $('#loader').addClass('loading-track-loaded')
        }, 2000);
    }

    render() {
        return (
            <div id="loader" className="loading-track">
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

    constructor(props) {
        super(props);
        this.state = {
            showModal: false,
            modalTarget: null,
            targetIndex: null,
            qrStatus: null
        };
    }

    componentDidMount() {
        this.squareImages();
    }

    componentDidUpdate(prevProps) {
        this.squareImages();

        if (prevProps.activity != this.props.activity) {
            this.setState({ qrStatus: null });
        }
    }

    squareImages() {
        $('.d-square').each(() => $(this).css('height', $(this).offsetWidth));
    }

    showImageModal(target, index) {
        this.setState({
            showModal: true,
            modalTarget: target,
            targetIndex: index
        });
    }

    onImageSelect(imageData) {
        let target = this.state.modalTarget;

        if (target == 'images') {
            let activityImages = this.props.activity.images;
            activityImages[this.state.targetIndex] = (imageData);        
            return this.props.updateField('images', activityImages);
        }
        console.log(imageData);
        this.props.updateField('image', imageData);

        this.setState({
            showModal: false,
            modalTarget: null
        });
    }

    onImageClear(target, index) {
        if (target == 'image') {
            this.props.updateField('image', null);
        }

        // else remove index from images
        let images = this.props.activity.activityImages;
        images.splice(index, 1);
        this.props.updateField('images', images);
    }

    onQrEdit(code) {
        this.props.updateField('qrCode', code);

        $.ajax({
            type: 'get',
            url: `${url}/validate-qr`,
            data: {
                qrCode: code,
                excludeId: this.props.activity.id
            }
        }).done(qrStatus => {
            this.setState({
                qrStatus
            });
        });
    }

    render() {                   

        if (!this.props.activity || !this.props.factFiles) return <div></div>;

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

        let qrCode = (
            <FormGroup htmlFor="qr-code" label="QR Code" required>
                <Input id="qr-code" type="text" value={this.props.activity.qrCode} cb={this.onQrEdit.bind(this)} required />
                <small className={`${this.state.qrStatus ? 'text-success' : 'text-danger'} float-right font-weight-bold`}>{this.state.qrStatus == null || !this.props.activity.qrCode ? '' : this.state.qrStatus ? 'QR code is available' : 'QR code is in use' }</small>
            </FormGroup>
            );
        
        let title = activityType != 'Fact File' ? (
            <FormGroup htmlFor="activity-title" label="Activity Title" required>
                <Input id="activity-title" type="text" value={this.props.activity.title} cb={this.props.updateField.bind(this, 'title')} required />
            </FormGroup>
        ) : null;

        let factFile = (
            <FormGroup htmlFor="fact-file-id" label="Linked Fact File" required={activityType == 'Fact File'}>
                <Select id="fact-file-id" formattedOptions={factFileOptions}
                    cb={this.props.updateField.bind(this, 'factFile')}
                    selected={this.props.activity.factFile ? this.props.activity.factFile.id : null} required={activityType == 'Fact File'} />
            </FormGroup>
        );

        let description, task, image;

        if (activityType != 'Fact File') {
            if (activityType != 'Photograph Activity') {
                image = (
                    <Fragment>
                        <hr className="mx-3 mt-4" />
                        <Card>
                            <CardHighlight>
                                <h5 className="mt-3 mb-2">Main Image</h5>
                            </CardHighlight>
                            {this.props.activity.image ? (
                                <div className="main-activity-image col-6 p-0 d-square mx-auto">
                                    <img className="img-fluid w-100 object-fit-cover" onClick={this.showImageModal.bind(this, 'image')} src={`/media?filename=${this.props.activity.image.filename}`} />                                    
                                    <div onClick={this.showImageModal.bind(this, 'image')} className="hover-effect">Change</div>
                                </div>
                            ) : (
                                    <Button className="btn btn-success my-5 mx-auto w-30" cb={this.showImageModal.bind(this, 'image')}><i className="fas fa-plus"></i> &nbsp; Add Image</Button>
                                )}
                        </Card>
                    </Fragment>
                );
            }

            description = (
                <Fragment>
                    <hr className="mx-3 mt-4" />
                    <FormGroup htmlFor="description" label="Activity Description">
                        <TextArea id="description" value={this.props.activity.description} rows="4"
                            cb={this.props.updateField.bind(this, 'description')} inputClass="resize-none" />
                    </FormGroup>
                </Fragment>
            );

            task = (
                <FormGroup htmlFor="task" label="Activity Task">
                    <Input type="text" value={this.props.activity.task} cb={this.props.updateField.bind(this, 'task')} />
                </FormGroup>
                );
        }

        let activityImages;
        let images = this.props.activity.images;

        if (activityType == 'Picture Select Activity') {
            activityImages = (
                <Fragment>
                    <hr className="mx-3 mt-4" />
                    <Card>
                        <CardHighlight>
                            <h5 className="mt-3 mb-2">Selection Options</h5>
                        </CardHighlight>
                        <div className="row">
                            <div className="col-6 col-md-4">
                                <div className="card pic-select-card d-square">
                                    <img className="img-fluid" src={images[0] ? `/media?filename=${images[0].filename}` : '/images/no-image.png'} />
                                    <Button className={`btn center-text ${images[0] ? 'btn-clear' : 'btn-success'}`} cb={this.showImageModal.bind(this, 'images', 0)}>
                                        <span>{images[0] ? 'Change' : 'Add'}</span>
                                    </Button>
                                </div>
                            </div>
                            <div className="col-6 col-md-4">
                                <div className="card pic-select-card d-square">
                                    <img className="img-fluid" src={images[1] ? `/media?filename=${images[1].filename}` : '/images/no-image.png'} />
                                    <Button className={`btn center-text ${images[1] ? 'btn-clear' : 'btn-success'}`} cb={this.showImageModal.bind(this, 'images', 1)}>
                                        <span>{images[1] ? 'Change' : 'Add'}</span>
                                    </Button>
                                </div>
                            </div>
                            <div className="col-6 col-md-4">
                                <div className="card pic-select-card d-square">
                                    <img className="img-fluid" src={images[2] ? `/media?filename=${images[2].filename}` : '/images/no-image.png'} />
                                    <Button className={`btn center-text ${images[2] ? 'btn-clear' : 'btn-success'}`} cb={this.showImageModal.bind(this, 'images', 2)}>
                                        <span>{images[2] ? 'Change' : 'Add'}</span>
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </Card>
                </Fragment>
                );
        }

        return (
            <Card className="mt-1">
                <CardHighlight className="position-relative">
                    <h5 className="mt-4 mb-3 ml-3 text-left">{this.props.activity.title}</h5>
                    <ConfirmModal className="btn btn-dark pos-top-right" cb={this.props.onDelete} question={`Delete ${this.props.activity.title}`}>
                        <i className="fas fa-trash"></i>
                        &nbsp; Delete Activity
                    </ConfirmModal>
                </CardHighlight>
                
                <CardBody>

                    {activeStatus}

                    <form id="activity-form" onSubmit={(e) => this.props.onSave(e)}>                           
                        <FormGroup htmlFor="activity-type" label="Activity Type:" required>
                            <Select formattedOptions={typeOptions} selected={this.props.activity.activityType} cb={this.props.updateField.bind(this, 'activityType')} required />
                        </FormGroup>
                        {qrCode}
                        {title}
                        {factFile}
                        {description}
                        {task}
                        {image}
                        {activityImages}                        
                    </form>
                </CardBody>

                <SelectMedia
                    type="Image"
                    showModal={this.state.showModal}
                    cb={(imageData) => this.onImageSelect(imageData)}
                    handleHideModal={() => {
                        this.setState({showModal: false, modalTarget: null});
                    }}
                />

            </Card>
            )
    }
}

            