import React, { Component, Fragment } from 'react';
import { Button } from '../Components/Button';
import { ToggleVisibility } from './PageControlButtons';


export default class PageControls extends Component {
    render() {
        if (!this.props.allowEdits)
            return (
                <Button btnClass="btn btn-dark float-right" cb={this.props.editMode.bind(this, true)}>
                    Edit Page
                </Button>
            );

        return (
            <div className="row text-center sticky-top bg-white pb-2" style={{ 'marginTop': '-1rem', 'borderBottom': 'black solid' }}>
                <div className="col-12 mb-2">
                    <i class="fas fa-tachometer-alt-slow" /> Editors Dashboard
                </div>

                <div className="col-lg-3 col-md-6 col-sm-12">
                    More Dropdown
                </div>

                <div className="col-lg-3 col-md-6 col-sm-12">
                    <ToggleVisibility className="btn btn-outline-dark btn-sm"
                        public={this.props.public}
                        u={this.props.u}
                    />
                </div>

                <div className="col-lg-3 col-md-6 col-sm-12">
                    <Button className="btn btn-outline-dark btn-sm" cb={this.props.revert}>
                        Revert Changes <i className="fas fa-undo" />
                    </Button>
                </div>

                <div className="col-lg-3 col-md-6 col-sm-12">
                    <Button className="btn btn-outline-success btn-sm" cb={this.props.publish}>
                        Publish Changes <i className="fas fa-check-circle" />
                    </Button>
                </div>
            </div>
        );
    }
}