import React, { Component, Fragment } from 'react';
import { Button } from '../Components/Button';
import { EditPageSettings, ToggleVisibility, ViewPageDashboard } from './PageControlButtons';


export default class PageControls extends Component {
    render() {
        if (this.props.settings)
            return null;

        if (!this.props.allowEdits)
            return (
                <div className="float-right-above">
                    <ToggleVisibility className="btn btn-dark mr-2"
                        public={this.props.page.public}
                        pageId={this.props.page.id}
                        u={this.props.u}
                    />

                    <Button className="btn btn-dark mr-2" cb={this.props.editMode.bind(this, true)}>
                        Edit Page
                    </Button>
                    <ViewPageDashboard className="btn btn-dark mr-2" />
                </div>
            );

        return (
            <div id="editorsdash" className="row sticky-top text-white bg-dark fade1sec py-3" style={{ 'marginTop': '-1rem', 'marginLeft': '-30px', 'marginRight': '-30px' }}>
                <h4 className="col-lg-4 col-md-12 mb-2 noselect">
                    <i className="fas fa-tachometer-alt-slow fa-x3" /> Editors Dashboard
                </h4>

                <div className="col-lg-2 col-sm-6 text-center">
                    <div className="dropdown">
                        <button className="btn btn-dark btn-sm dropdown-toggle" data-toggle="dropdown" aria-expanded="false" type="button"> More Options  </button>
                        <div role="menu" className="dropdown-menu text-left">
                            <EditPageSettings className="dropdown-item" pageId={this.props.page.id}/>
                            <ViewPageDashboard className="dropdown-item"/>
                        </div>
                    </div>
                </div>

                <div className="col-lg-2 col-sm-6 text-center">
                </div>

                <div className="col-lg-2 col-sm-6 text-center">
                    <Button className="btn btn-danger btn-sm" cb={this.props.revert}>
                        Revert Changes <i className="fas fa-undo" />
                    </Button>
                </div>

                <div className="col-lg-2 col-sm-6 text-center">
                    <Button className="btn btn-success btn-sm" cb={this.props.publish}>
                        Publish Changes <i className="fas fa-check-circle" />
                    </Button>
                </div>
            </div>
        );
    }
}