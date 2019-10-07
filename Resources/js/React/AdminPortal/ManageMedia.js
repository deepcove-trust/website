import React, { Component } from 'react';
import { render } from 'react-dom';
import Gallery from './ManageMedia/Gallery';
import Details from './ManageMedia/Details';
import Upload from './ManageMedia/Upload';

const sections = {
    1: Gallery,
    2: Details,
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
                <div className="col-12 fade1sec">
                    <Template data={this.state.media || null}
                        setTab={(tab) => this.setState({
                                tab
                            })
                        }
                        viewDetails={(media) => this.setState({
                            tab: 2,
                            media
                        })
                    } />
                </div>
            </div>    
        )
    }
}

if (document.getElementById('react_ManageMedia'))
    render(<ManageMedia />, document.getElementById('react_ManageMedia'));    