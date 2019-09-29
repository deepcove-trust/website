import React, { Component, Fragment } from 'react';
import { Button, BtnGroup } from '../../../Components/Button';
import { convertSize } from '../../../../helpers';
import _ from 'lodash';
import $ from 'jquery';
import { FormGroup, Input, Checkbox } from '../../../Components/FormControl';


const baseUri = "/admin/media"

export default class MetaData extends Component {
    constructor(props) {
        super(props);

        this.state = {
            edit: false,
            file: null
        }
    }

    componentDidMount() {
        console.log(`${baseUri}/data/${this.props.file.id}`)
        $.ajax({
            method: 'get',
            url: `${baseUri}/data/${this.props.file.id}`
        }).done((file) => {
            this.setState({
                file,
                default: _.cloneDeep(file)
            });
        }).fail((err) => {
            console.error(`[MetaData@getData] Error getting data: `, err.responseText);
        })
    }

    updateFile(field, val) {
        console.log(field, val)
        let file = this.state.file;
        file[field] = val;

        this.setState({
            file
        });
    }

    submitChanges(id) {
        $.ajax({
            method: 'patch',
            url: `${baseUri}/${id}`,
            data: this.state.file
        }).done(() => {
            //What do?
        }).fail((err) => {

        });
    }

    render() {
        if (!this.state.file)
            return <div />

        return (
            <div className="row">
                <div className="col-12">
                    <h3>Detials</h3>
                </div>

                <div className="col-md-6 col-sm-12">
                    <Title title={this.state.file.title}
                        name={this.state.file.name}
                        edit={this.state.edit}
                        cb={this.updateFile.bind(this, 'title')}
                    />
                    <AltText altText={this.state.file.alt}
                        edit={this.state.edit}
                        cb={this.updateFile.bind(this, 'alt')}
                    />
                    <Source source={this.state.file.source}
                        edit={this.state.edit}
                        cb={this.updateFile.bind(this, 'source')}
                    />
                </div>

                <div className="col-md-6 col-sm-12">
                    <FormGroup label="Size:">
                        <input type="text" className="form-control-plaintext"
                            value={convertSize(this.state.file.size) || ""}
                            disabled
                        />
                    </FormGroup>

                    <FormGroup label="Type:">
                        <input type="text" className="form-control-plaintext"
                            value={this.state.file.mediaType.value.toLowerCase() || ""}
                            disabled
                        />
                    </FormGroup>
                </div>

                <div className="col-12">
                    <EditButtons editMode={this.state.edit}
                        setEditMode={() => {
                            this.setState({
                                edit: true
                            })
                        }}

                        save={null}

                        reset={() => {
                            this.setState({
                                edit: false,
                                file: _.cloneDeep(this.state.default)
                            })
                        }}
                    />
                </div>
            </div>
        )
    }
}

class EditButtons extends Component {
    render() {
        if (this.props.editMode) {
            return (
                <BtnGroup>
                    <Button className="btn btn-danger btn-sm" cb={this.props.reset}>
                        Cancel <i className="fas fa-times"/>
                    </Button>

                    <Button className="btn btn-success btn-sm" cb={this.props.save}>
                        Save <i className="fas fa-check" />
                    </Button>
                </BtnGroup>
            )
        } else {
            return (
                <Button className="btn btn-dark btn-sm mx-1" cb={this.props.setEditMode}>
                    Edit Details <i className="fas fa-pencil" />
                </Button>
            )
        }
    }
}

class Title extends Component {
    render() {
        let input = this.props.edit ? <Input type="text"
            value={this.props.title || this.props.name || ""}
            cb={this.props.cb} />

            : <input type="text" className="form-control-plaintext"
                value={this.props.title || this.props.name || ""}
                disabled />
        
        return (
            <FormGroup label="Title:">
                {input}
            </FormGroup>
        )
    }
}

class AltText extends Component {
    render() {
        let input = this.props.edit ? <Input type="text"
            value={this.props.altText || ""}
            cb={this.props.cb} />

            : <input type="text" className="form-control-plaintext"
                value={this.props.altText || ""}
                disabled />

        return ( 
            <FormGroup label="Alt Text:">
                {input}
            </FormGroup>
        )
    }
}

class Source extends Component {
    updateSource(e) {
        this.props.cb({
            info: e,
            showCopyright: this.props.source.showCopyright
        })
    }

    toggleSource(e) {
        this.props.cb({
            info: this.props.source.info,
            showCopyright: e
        })
    }

    render() {
        let input;
        if (this.props.edit) {
            input = (
                <Input type="text"
                    value={this.props.source.info || ""}
                    cb={this.updateSource.bind(this)}
                />
            )
        } else {
            input = (
                <input type="text" className="form-control-plaintext"
                    value={this.props.source.info || ""}
                    disabled
                />                
            )
        }

        let copyright;
        if (this.props.edit) {
            copyright = (
                <Checkbox id="ShowCopyright"
                    checked={this.props.source.showCopyright}
                    label="Display source information"
                    cb={this.toggleSource.bind(this)}
                />
            )
        } else if (this.props.source && this.props.source.showCopyright) {
            copyright = (
                <small className="text-muted mt-0">
                    <i className="far fa-copyright" /> Display copyright
                </small>
            )
        }
        
        return (
            <FormGroup label="Source:">
                {input}
                {copyright}
            </FormGroup>
        )
    }
}