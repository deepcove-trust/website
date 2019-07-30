import React, { Component } from 'react';
import { render } from 'react-dom';
import Panel from '../Components/Panel';
import QuickLinks from './WebSettings/QuickLinks';
import $ from 'jquery';
import MissionStatement from './WebSettings/MissionStatement';


const baseUri = `/admin-portal/users`;

export default class Settings extends Component {
    constructor(props) {
        super(props);

        this.state = {
            
        }
    }

    componentDidMount() {
        //this.getData();
    }

    //getData() {
    //    $.ajax({
    //        type: 'get',
    //        url: `${baseUri}/data`
    //    }).done((data) => {
    //        this.setState({ accounts: null }, () => {
    //            this.setState({ accounts: data });
    //        });
    //    }).fail((err) => {
    //        console.error(`[User@getData] Error getting data: `, err.responseText);
    //    })
    //}

    render() {
        return (
            <div className="row">
                <div className="col-12">
                    <h1 className="text-center">Website Settings</h1>
                    <Panel>
                        <div className="row">
                            <div className="col-lg-6 col-sm-12">
                                <QuickLinks />
                            </div>

                            <div className="col-lg-6 col-sm-12">
                                <MissionStatement />
                            </div>
                        </div>
                    </Panel>
                </div>
            </div>
        );
    }
}

if (document.getElementById('react_websiteSettings'))
    render(<Settings />, document.getElementById('react_websiteSettings'));    