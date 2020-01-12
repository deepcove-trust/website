import React, { Component } from 'react';
import { render } from 'react-dom';
import Alert from '../Components/Alert';
import NoticesOverview from './Noticeboard/NoticesOverview';
import Editor from './Noticeboard/Editor';

const components = {
    0: NoticesOverview,
    1: Editor
}

import $ from 'jquery';


const baseUri = `/admin/noticeboard`;

class Noticeboard extends Component {
    constructor(props) {
        super(props);

        this.state = {
            important: [],
            normal: [],
            disabled: [],
            viewIndex: 1
        }
    }

    componentDidMount() { this.getData(); }

    getData() {
        $.ajax({
            method: 'get',
            url: `${baseUri}/data`
        }).done((notice) => {
            this.setState({
                important: notice.important,
                normal: notice.normal,
                disabled: notice.disabled
            });
        }).fail((err) => {
            console.log(err);
        });
    }

    render() {       
        const TemplateName = components[this.state.viewIndex];

        return (
            <Alert className="row" onRef={ref => (this.Alert = ref)}>
                <div className="col-12">
                    <h1 className="text-center">Noticeboard</h1>
                </div>

                <TemplateName 
                    important={this.state.important}
                    normal={this.state.normal}
                    disabled={this.state.disabled}
                    selected={this.state.important[0]}
                    alert={this.Alert}
                />
            </Alert>
        )
    }
}

if (document.getElementById('react_Noticeboard'))
    render(<Noticeboard />, document.getElementById('react_Noticeboard'));