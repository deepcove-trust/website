import React, { Component, Fragment } from 'react';
import { render } from 'react-dom';
import { Button } from '../Components/Button';

import ProgressBar from './PagesNew/ProgressBar';
import PageDetails from './PagesNew/PageDetails';

import $ from 'jquery';

const baseUri = "/admin/web/pages/new";
const ApiBaseUri = "/api"

export default class NewPageWrapper extends Component {
    constructor(props) {
        super(props);

        this.state = {
            stage: 1,
            page: null,
        }
    }

    render() {
        let DivBlock; 
        if (this.state.stage == 1)
            DivBlock = (
                <PageDetails
                    cb={(data) => {
                        this.setState({
                            stage: 2,
                            page: data
                        });
                    }}
                />
            );
        else if (this.state.stage == 2)
            DivBlock = <PageTemplates />;
        else
            DivBlock = <PageDetails />;

        return (
            <Fragment>
                <ProgressBar progress={this.state.stage} />
                {DivBlock}
            </Fragment>
        );
    }
}



class PageTemplates extends Component {
    render() {
        return (
            <Fragment>
                <div className="row">
                    <div className="col-12">
                        <h1 className="text-center pb-3">Select a Template</h1>
                    </div>
                </div>    

                <div className="col-12">
                    <Button btnClass="btn btn-info float-left">
                        <i className="far fa-arrow-circle-left"></i> Back
                            </Button>

                    <Button btnClass="btn btn-info float-right">
                        Next <i className="far fa-arrow-circle-right"></i>
                    </Button>
                </div>
            </Fragment>
        )
    }
}

if (document.getElementById('react_PagesNew'))
    render(<NewPageWrapper />, document.getElementById('react_PagesNew'));