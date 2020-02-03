import React, { Component, Fragment } from 'react';
import FileProperties from './FileProperties';
import MetaButtons from './MetaButtons';
import FileDetails from './FileDetails';
import FileUsages from './FileUsages';

import $ from 'jquery';
import _ from 'lodash';
import Card from '../../../Components/Card';

const baseUri = "/admin/media"

export default class MetaData extends Component {
    constructor(props) {
        super(props);

        this.state = {
            edit: false,
            file: null,
            default: null,
            pending: false
        }
    }

    componentDidMount() {
        this.getData();
    }

    getData() {
        $.ajax({
            method: 'get',
            url: `${baseUri}/data/${this.props.file.id}`
        }).done((file) => {
            this.setState({
                file,
                default: _.cloneDeep(file),
                edit: false,
                pending: false
            })
        }).fail((err) => {
            console.error(`[Metadata@getData] Error getting file data: `, err.responseText);
        })
    }

    submitChanges() {
        this.setState({
            pending: true,
            edit: false
        }, () => {
            let file = this.state.file;
            $.ajax({
                method: 'patch',
                url: `${baseUri}/${this.state.file.id}`,
                data: {
                    name: file.name,
                    source: file.source.info,
                    showCopyright: file.source.showCopyright,
                    title: file.title,
                    alt: file.alt
                }
            }).done(() => {
                this.props.alert.success("Changes saved!")
                this.getData();
            }).fail((err) => {
                this.props.alert.error(null, err.responseText)
            })
        })
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
            <Card>
                <FileDetails edit={this.state.edit}
                    file={this.state.file}
                    cb={this.updateField.bind(this)}
                />
            
                <FileProperties edit={this.state.edit}
                    file={this.state.file}
                    cb={this.updateField.bind(this)}
                />

                <MetaButtons edit={this.state.edit}
                    alert={this.props.alert}
                    fileId={this.state.file.id}
                    pending={this.state.pending}
                    setEdit={(edit) => this.setState({ edit })}
                    saveChanges={this.submitChanges.bind(this)}
                    deleteCb={this.props.deleteCb}
                    cancel={() => {
                        this.setState({
                            edit: false,
                            file: _.cloneDeep(this.state.default)
                        });
                    }}
                />

                <div className="py-3">
                    <FileUsages usages={this.state.file.usages} />
                </div>
            </Card>
        )
    }
}