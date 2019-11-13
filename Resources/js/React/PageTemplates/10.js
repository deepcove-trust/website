import React, { Component, Fragment } from 'react';
import TextBlock from '../CMS-Blocks/Text';
import Media from '../CMS-Blocks/Media';

export default class ReactTemplate10 extends Component {
    render() {
        return (
            <Fragment>
                <div className="row">
                    <div className="col-12 px-0">
                        <video width="100%" loop autoPlay={true} muted>
                            <source src="/images/feature_video.mp4" type="video/mp4" />
                            <source src="/images/feature_video.ogg" type="video/ogg"/>
                            Your browser does not support the video tag.
                        </video>
                    </div>

                    <div className="col-12 pt-5 pb-4 text-center">
                        <h3>Experience life in a remote part of the Fiordland National Park</h3>
                    </div>

                    <div className="col-lg-6 col-md-12">
                        <TextBlock allowEdits={this.props.allowEdits}
                            content={this.props.data.textComponents[0] || null}
                            pushChanges={this.props.pushChanges.bind(this, 'text')}
                            settings={this.props.data.enums}
                        />
                    </div>
                    <div className="col-lg-6 col-md-12">
                        <TextBlock allowEdits={this.props.allowEdits}
                            content={this.props.data.textComponents[1] || null}
                            pushChanges={this.props.pushChanges.bind(this, 'text')}
                            settings={this.props.data.enums}
                        />
                    </div>
                </div>


                <div className="row pt-4">
                    <div className="col-lg-4 col-md-2 col-sm-12 mb-4">
                        <div style={{ 'margin': '-1rem 0rem 2rem 0rem' }}>
                            <Media minHeight="200"
                                allowEdits={this.props.allowEdits}
                                content={this.props.data.mediaComponents[0] || null}
                                pushChanges={this.props.pushChanges.bind(this, 'media')}
                            />
                        </div>

                        <TextBlock allowEdits={this.props.allowEdits}
                            content={this.props.data.textComponents[2] || null}
                            pushChanges={this.props.pushChanges.bind(this, 'text')}
                            settings={this.props.data.enums}
                        />
                    </div>

                    <div className="col-lg-4 col-md-2 col-sm-12 mb-4">
                        <div style={{ 'margin': '-1rem 0rem 2rem 0rem' }}>
                            <Media minHeight="200"
                                allowEdits={this.props.allowEdits}
                                content={this.props.data.mediaComponents[1] || null}
                                pushChanges={this.props.pushChanges.bind(this, 'media')}
                            />
                        </div>

                        <TextBlock allowEdits={this.props.allowEdits}
                            content={this.props.data.textComponents[3] || null}
                            pushChanges={this.props.pushChanges.bind(this, 'text')}
                            settings={this.props.data.enums}
                        />
                    </div>

                    <div className="col-lg-4 col-md-2 col-sm-12 mb-4">
                        <div style={{ 'margin': '-1rem 0rem 2rem 0rem' }}>
                            <Media minHeight="200"
                                allowEdits={this.props.allowEdits}
                                content={this.props.data.mediaComponents[2] || null}
                                pushChanges={this.props.pushChanges.bind(this, 'media')}
                            />
                        </div>

                        <TextBlock allowEdits={this.props.allowEdits}
                            content={this.props.data.textComponents[4] || null}
                            pushChanges={this.props.pushChanges.bind(this, 'text')}
                            settings={this.props.data.enums}
                        />
                    </div>

                    <div className="col-lg-4 col-md-2 col-sm-12 mb-4">
                        <div style={{ 'margin': '-1rem 0rem 2rem 0rem' }}>
                            <Media minHeight="200"
                                allowEdits={this.props.allowEdits}
                                content={this.props.data.mediaComponents[3] || null}
                                pushChanges={this.props.pushChanges.bind(this, 'media')}
                            />
                        </div>

                        <TextBlock allowEdits={this.props.allowEdits}
                            content={this.props.data.textComponents[5] || null}
                            pushChanges={this.props.pushChanges.bind(this, 'text')}
                            settings={this.props.data.enums}
                        />
                    </div>

                    <div className="col-lg-4 col-md-2 col-sm-12 mb-4">
                        <div style={{ 'margin': '-1rem 0rem 2rem 0rem' }}>
                            <Media minHeight="200"
                                allowEdits={this.props.allowEdits}
                                content={this.props.data.mediaComponents[4] || null}
                                pushChanges={this.props.pushChanges.bind(this, 'media')}
                            />
                        </div>

                        <TextBlock allowEdits={this.props.allowEdits}
                            content={this.props.data.textComponents[6] || null}
                            pushChanges={this.props.pushChanges.bind(this, 'text')}
                            settings={this.props.data.enums}
                        />
                    </div>

                    <div className="col-lg-4 col-md-2 col-sm-12 mb-4">
                        <div style={{ 'margin': '-1rem 0rem 2rem 0rem' }}>
                            <Media minHeight="200"
                                allowEdits={this.props.allowEdits}
                                content={this.props.data.mediaComponents[5] || null}
                                pushChanges={this.props.pushChanges.bind(this, 'media')}
                            />
                        </div>

                        <TextBlock allowEdits={this.props.allowEdits}
                            content={this.props.data.textComponents[7] || null}
                            pushChanges={this.props.pushChanges.bind(this, 'text')}
                            settings={this.props.data.enums}
                        />
                    </div>
                </div>
            </Fragment>
        );
    }
}