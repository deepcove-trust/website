import React, { Component, Fragment } from 'react';
import PageTitle from '../CMS-Blocks/PageTitle';
import TextBlock from '../CMS-Blocks/Text';
import MediaBlock from '../CMS-Blocks/Media';


export default class ReactTemplate4 extends Component {
    constructor(props) {
        super(props);

        this.state = {
            data: null,
            pageId: null,
        }
    }


    render() {
        return (
            <Fragment>
                <div className="row">
                    <div className="col-12 px-0 mb-4" style={{ 'marginTop': '-1rem' }}>
                        <MediaBlock allowEdits={this.props.allowEdits}
                            content={this.props.data.mediaComponents[0] || null}
                            pushChanges={this.props.pushChanges.bind(this, 'media')}
                        />
                    </div>

                    <div className="col-12">
                        <PageTitle title={this.props.data.name}
                            public={this.props.data.public}
                            created={this.props.data.created}
                            displayAdmin={!!this.props.data.enums}
                        />
                    </div>

                    <div className="col-12 py-2">
                        <TextBlock allowEdits={this.props.allowEdits}
                            content={this.props.data.textComponents[0] || null}
                            pushChanges={this.props.pushChanges.bind(this, 'text')}
                            settings={this.props.data.enums}
                        />
                    </div>

                    <div className="col-md-6 col-sm-12 mb-2">
                        <MediaBlock allowEdits={this.props.allowEdits}
                            content={this.props.data.mediaComponents[1] || null}
                            pushChanges={this.props.pushChanges.bind(this, 'media')}
                        />
                    </div>

                    <div className="col-md-6 col-sm-12 mb-2">
                        <MediaBlock allowEdits={this.props.allowEdits}
                            content={this.props.data.mediaComponents[2] || null}
                            pushChanges={this.props.pushChanges.bind(this, 'media')}
                        />
                    </div>

                    <div className="col-12 py-2">
                        <TextBlock allowEdits={this.props.allowEdits}
                            content={this.props.data.textComponents[1] || null}
                            pushChanges={this.props.pushChanges.bind(this, 'text')}
                            settings={this.props.data.enums}
                        />
                    </div>
                </div>
            </Fragment>
        );
    }
}