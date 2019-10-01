import React, { Component, Fragment } from 'react';
import Panel from '../../../Components/Panel';
import MetaButtons from './MetaButtons';
import FileProperties from './FileProperties';

import $ from 'jquery';
import _ from 'lodash';
import FileDetails from './FileDetails';

const baseUri = "/admin/media"

export default class MetaData extends Component {
    constructor(props) {
        super(props);

        this.state = {
            edit: false,
            file: null,
            default: null
        }
    }

    componentDidMount() {
        $.ajax({
            method: 'get',
            url: `${baseUri}/data/${this.props.file.id}`
        }).done((file) => {
            this.setState({
                file,
                default: _.cloneDeep(file)
            })
        }).fail((err) => {
            console.error(`[Metadata@getData] Error getting file data: `, err.responseText);
        })
    }

    submitChanges() {
        console.log("update file ajax call here.")
        console.log("set edit to false, then cb?")
    }

    updateField(field, val) {
        let file = this.state.file;
        file[field] = val;
        this.setState({
            file
        });
    }

    render() {
        if (!this.state.file) return <div />

        return (
            <Fragment>
                <div className="py-3">
                    <FileDetails edit={this.state.edit}
                        file={this.state.file}
                        cb={this.updateField.bind(this)}
                    />
                </div>

                <div className="py-3">
                    <FileProperties edit={this.state.edit}
                        file={this.state.file}
                        cb={this.updateField.bind(this)}
                    />
                </div>

                <MetaButtons edit={this.state.edit}
                    fileId={this.state.file.id}
                    setEdit={(edit) => this.setState({ edit })}
                    saveChanges={this.submitChanges.bind(this)}
                    cancel={() => {
                        this.setState({
                            edit: false,
                            file: _.cloneDeep(this.state.default)
                        });
                    }}
                />
            </Fragment>
        )
    }
}