import React, { Component, Fragment } from 'react';
import PageTitle from '../CMS-Blocks/PageTitle';
import MediaBlock from '../CMS-Blocks/Media';

export default class ReactTemplate12 extends Component {
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

                        <PageTitle title={this.props.data.name}
                            public={this.props.data.public}
                            created={this.props.data.created}
                            displayAdmin={!!this.props.data.enums}
                        />
                    </div>
                </div>
            </Fragment>
        );
    }
}