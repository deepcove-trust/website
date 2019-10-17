import React, { Component } from 'react';
import PageTitle from '../CMS-Blocks/PageTitle';
import TextBlock from '../CMS-Blocks/Text';
import Media from '../CMS-Blocks/Media';

const baseUri = "/api/page"

export default class ReactTemplate2 extends Component {
    constructor(props) {
        super(props);

        this.state = {
            data: null,
            pageId: null,
        }
    }

    render() {
        return (
            <React.Fragment>
                <div className="row">
                    <div className="col-12 px-0 mb-4" style={{ 'marginTop': '-1rem' }}>
                        <Media allowEdits={this.props.allowEdits}
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

                    <div className="col-lg-6 col-md-12 py-2">
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
            </React.Fragment>
        );
    }
}