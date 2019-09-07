import React, { Component } from 'react';
import { render } from 'react-dom';
import Gallery from './ManageMedia/Gallery';
import Detials from './ManageMedia/Details';
import Upload from './ManageMedia/Upload';

import { Button } from '../Components/Button';


const sections = {
    1: Gallery,
    2: Detials,
    3: Upload
}

export default class ManageMedia extends Component {
    constructor(props) {
        super(props);

        this.state = {
            tab: 1
        }
    }


    render() {
        const Template = sections[this.state.tab];

        let uploadBtn;
        if (this.state.tab != 3) {
            uploadBtn = (
                <Button className="btn btn-dark  float-right" cb={() => this.setState({
                        tab: 3
                    })
                }>
                    Upload File <i className="fas fa-upload"></i>
                </Button>    
            )
        }

        return (
            <div className="row">
                <div className="col-12">
                    <h1 className="text-center">Media Centre</h1>

                    {uploadBtn}
                </div>

                <div className="col-12 fade1sec">
                    <Template data={null} />
                </div>
            </div>    
        )
    }
}

if (document.getElementById('react_ManageMedia'))
    render(<ManageMedia />, document.getElementById('react_ManageMedia'));    