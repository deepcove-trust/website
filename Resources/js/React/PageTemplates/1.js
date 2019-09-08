import React, { Component } from 'react';
import PageTitle from '../CMS-Blocks/PageTitle';
import TextBlock from '../CMS-Blocks/Text';
import Media from '../CMS-Blocks/Media';

export default class ReactTemplate1 extends Component {
    render() {
        return (
            <div className="row">
                <div className="col-12 px-0">
                    <Media minHeight="440"/>
                </div>

                <div className="col-12 pt-3">
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

                <div className="row">
                    <div className="col-lg-3 col-md-2 col-sm-12">
                        
                    </div>
                </div>
            </div>
        );
    }
}