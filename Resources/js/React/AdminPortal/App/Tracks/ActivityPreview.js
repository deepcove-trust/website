import React, { Component } from 'react';
import DevicePreview from '../../../Components/DevicePreview';
import FactFilePreview from '../FactFiles/FactFilePreview';
import $ from 'jquery';

export default class ActivityPreview extends Component {
    render() { 

        let activity = this.props.activity;

        if (!activity) return <div></div>; 

        let image = activity.image
            ? (
                <div className="w-90 d-square my-3 mx-auto">
                    <img src={`/media?filename=${activity.image.filename}`} className="w-100 img-fluid" />
                </div>
            )
            : <div className="mb-3"></div>;

        let bookIcon = activity.factFile ? (
            <div className="fact-file-icon"><i className="fas fa-book"></i></div>
        ) : null;

        let desc = activity.description ? activity.description.split('\n').map((p, index) => {
            return <p key={index} className="text-left mx-3">{p}</p>
        }) : null;               

        let task = activity.task ? <h6 className="my-4 mx-3">{activity.task}</h6> : null;

        let previewTypes = [InformationalActivity, CountActivity, PhotographActivity, PictureSelectActivity, PictureTapActivity, TextAnswerActivity]
        let ViewClass = previewTypes[this.props.activity.activityType];

        return (
            <DevicePreview sticky topBarGreen={this.props.activity.activityType != 0}>
                <ViewClass activity={this.props.activity} task={task} image={image} bookIcon={bookIcon} desc={desc} alert={this.props.alert} />
            </DevicePreview>
        );
    }
}

class InformationalActivity extends Component {

    constructor(props) {
        super(props);
        this.state = {
            entry: null,
            loaded: false
        };
    }

    componentDidMount() {
        this.getData();
    }

    componentDidUpdate(prevProps) {
        if (prevProps != this.props)
        {
            this.setState({
                entry: null,
                loaded: false
            }, this.getData.bind(this));
        }
    }

    getData() {
        if (!this.props.activity.factFile) return this.setState({loaded: true});

        $.ajax({
            type: 'get',
            url: `/admin/app/factfiles/entries/${this.props.activity.factFile.id}`
        }).done(entry => {
            this.setState({
                entry,
                loaded: true
            });
        }).fail(error => {
            this.props.alert.error(null, error.responseText);
        });
    }

    render() {
        return this.state.entry
            ? (
                <FactFilePreview previewEntry={this.state.entry} onBack={() => { }} />
            )
            : !this.state.loaded ? (
                <div className="center-text">
                    <i className="fas fa-spinner fa-2x fa-spin"></i>
                    <div>Loading...</div>
                </div>
            ) : (
                    <div className="center-text">
                        <div>Select a fact file</div>
                    </div>
                )
    }
}

class PhotographActivity extends Component {
    render() {
        return (
            <div className="preview-body with-back-button pt-3">
                <div className="activity-title">{this.props.activity.title}</div>

                {this.props.bookIcon}

                {this.props.desc}

                {this.props.task}

                <p>Your answer:</p>
                <div className="camera-section">
                    <div className="center-text w-90">
                        <i className="fas fa-camera fa-5x"></i>
                        <p className="my-4">Take a photo to begin</p>
                    </div>
                </div>

                <div className="photo-btn"><i className="fas fa-camera"></i></div>
                <BackButtonBar />
            </div>
        )
    }
}

class PictureTapActivity extends Component {
    render() {
        return (
            <div className="preview-body with-back-button pt-4">
                <div className="activity-title">{this.props.activity.title}</div>

                {this.props.bookIcon}                

                {this.props.desc}

                {this.props.task}

                {this.props.image}

                <BackButtonBar />
            </div>
        )
    }
}

class PictureSelectActivity extends Component {
    render() {
        return (
            <div className="preview-body with-back-button">
                <div className="activity-title">{this.props.activity.title}</div>

                {this.props.bookIcon}

                {this.props.image}

                {this.props.desc}

                {this.props.task}

                <hr className="mx-4 mt-4 mb-2" />                

                <div className="pic-select-section">
                    <i className="fas fa-chevron-left"></i>
                    <i className="fas fa-chevron-right"></i>
                    <div className="img-container">
                        <img src={this.props.activity.images[0] ? `/media?filename=${this.props.activity.images[0].filename}}` : `/images/no-image.png`} className="img-fluid w-100" />
                    </div>
                </div>

                <BackButtonBar />
            </div>
        )
    }
}

class CountActivity extends Component {
    render() {
        return (
            <div className="preview-body with-back-button">
                <div className="activity-title">{this.props.activity.title}</div>

                {this.props.bookIcon}

                {this.props.image}

                {this.props.desc}

                <hr className="mx-4 mt-4 mb-2" />

                {this.props.task}

                <div className="count-section">
                    <div className="count-section-inner">
                        <i className="fas fa-chevron-left fa-2x"></i>
                        <h2>0</h2>
                        <i className="fas fa-chevron-right fa-2x"></i>
                    </div>
                </div>

                <BackButtonBar />
            </div>
        )
    }
}

class TextAnswerActivity extends Component {
    render() {       
        return (
            <div className="preview-body with-back-button">
                <div className="activity-title">{this.props.activity.title}</div>

                {this.props.bookIcon}

                {this.props.image}

                {this.props.desc}                

                <hr className="mx-4 mt-4 mb-2" />

                {this.props.task}

                <div className="mock-input"></div>

                <BackButtonBar />
            </div>
        )
    }
}

class BackButtonBar extends Component {
    render() {
        return (
            <div className="back-button-bar">
                <span className="float-left ml-3 pass-save-btn">Pass</span>
                <span className="float-right mr-3 pass-save-btn">Save</span>
            </div>
        )
    }
}