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
            viewIndex: 0,
            selected: {}
        }
    }

    componentDidMount() { this.getData(); }

    changeView(viewIndex, selected) {
        this.setState({
            viewIndex,
            selected
        });
    }

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

    handleSubmit(id, notice) {
        $.ajax({
            url: `${baseUri}${id > 0 ? '/' + id : ''}`,
            method: `${id > 0 ? 'PUT' : 'POST'}`,
            data: notice
        }).done((msg) => {
            this.setState({
                viewIndex: 0,
                selected: {}
            }, () => {
                this.Alert.success(msg);
                this.getData();
            });
        }).fail((err) => {
            this.Alert.error(err);
        })
    }

    handleDelete(id) {
        $.ajax({
            url: `${baseUri}/${id}`,
            method: 'delete'
        }).done((msg) => {
            this.setState({
                viewIndex: 0,
                selected: {}
            }, () => {
                this.Alert.success(msg);
                this.getData();
            });
        }).fail((err) => {
            this.Alert.error(err);
        })
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
                    selected={this.state.selected}
                    alert={this.Alert}

                    cb_delete={this.handleDelete.bind(this)}
                    cb_edit={this.changeView.bind(this)}
                    cb_submit={this.handleSubmit.bind(this)}
                />
            </Alert>
        )
    }
}

if (document.getElementById('react_Noticeboard'))
    render(<Noticeboard />, document.getElementById('react_Noticeboard'));