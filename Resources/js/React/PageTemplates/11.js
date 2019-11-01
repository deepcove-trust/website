import React, { Component } from 'react';
import GoogleMap from '../CMS-Blocks/GoogleMap';
import PageTitle from '../CMS-Blocks/PageTitle';
import TextBlock from '../CMS-Blocks/Text';
import EmailForm from '../CMS-Blocks/EmailForm';

export default class ReactTemplate3 extends Component {
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
                <PageTitle title={this.props.data.name}
                    public={this.props.data.public}
                    created={this.props.data.created}
                    displayAdmin={!!this.props.data.enums}
                />


                <div className="row pb-4">
                    <div className="col-lg-4 col-md-6 col-sm-12">
                        <TextBlock allowEdits={this.props.allowEdits}
                            content={this.props.data.textComponents[0] || null}
                            pushChanges={this.props.pushChanges.bind(this, 'text')}
                            settings={this.props.data.enums}
                        />
                    </div>

                    <div className="col-lg-4 col-md-6 col-sm-12">
                        <TextBlock allowEdits={this.props.allowEdits}
                            content={this.props.data.textComponents[1] || null}
                            pushChanges={this.props.pushChanges.bind(this, 'text')}
                            settings={this.props.data.enums}
                        />
                    </div>

                    <div className="col-lg-4 col-md-6 col-sm-12">
                        <TextBlock allowEdits={this.props.allowEdits}
                            content={this.props.data.textComponents[2] || null}
                            pushChanges={this.props.pushChanges.bind(this, 'text')}
                            settings={this.props.data.enums}
                        />
                    </div>
                </div>

                <div className="row pt-2">
                    <div className="col-lg-6 col-md-12 pb-2">
                        <EmailForm config={this.props.data.otherComponents.captchaSiteKey}/>
                    </div>

                    <div className="col-lg-6 col-md-12">
                        <GoogleMap title="Where to Find Us"
                            config={this.props.data.otherComponents.googleMaps || null } />
                    </div>
                </div>
            </React.Fragment>
        );
    }
}