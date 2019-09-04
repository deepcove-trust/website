import React, { Component } from 'react';
import { render } from 'react-dom';
import Gallery from './ManageMedia/Gallery';
import Detials from './ManageMedia/Details';
import Upload from './ManageMedia/Upload';


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

        return (
            <div className="row">
                <div className="col-12">
                    <h1 className="text-center">Media Center</h1>
                </div>

                <Template data={null}/>
            </div>    
        )
    }
}

if (document.getElementById('react_ManageMedia'))
    render(<ManageMedia />, document.getElementById('react_ManageMedia'));    