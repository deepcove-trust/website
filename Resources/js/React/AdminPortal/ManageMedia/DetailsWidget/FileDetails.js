import React, { Component, Fragment } from 'react';
import { Input, Checkbox } from '../../../Components/FormControl';
import { convertSize } from '../../../../helpers';
import Panel from '../../../Components/Panel';

export default class FileDetails extends Component {
    render() {
        return (
            <Panel>
                <div className="table-responsive">
                    <table className="table table-sm">
                        <tbody>
                            <Name edit={this.props.edit}
                                file={this.props.file}
                                cb={this.props.cb.bind(this, 'name')}
                            />

                            <TypeSize file={this.props.file} />

                            <Source edit={this.props.edit}
                                file={this.props.file}
                                cb={this.props.cb.bind(this, 'source')}
                            />
                        </tbody>
                    </table>
                </div>
            </Panel>
        )
    }
}

class Name extends Component {
    render() {
        let field = <Fragment>{this.props.file.name}</Fragment>
        if (this.props.edit) {
            field = (
                <Input type="text"
                    value={this.props.file.name}
                    cb={this.props.cb}
                />
            )
        }

        return (
            <tr style={{ 'border': 'none' }}>
                <td>Name:</td>
                <td>{field}</td>
            </tr>
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
        let field = <Fragment>&copy; {this.props.file.source.info}</Fragment>
        if (this.props.edit) {
            field = (
                <Input type="text"
                    value={this.props.file.source.info}
                    cb={this.props.cb}
                />
            )
        }

        let toggle;
        if (this.props.edit) {
            toggle = (
                <Checkbox checked={this.props.file.source.showCopyright}
                    label="Show Copyright Symbol?"
                    labelAlign="left"
                    cb={this.toggleSource.bind(this)}
                />
            )
        }

        return (
            <Fragment>
                <tr>
                    <td>Source:</td>
                    <td className="text-right">{toggle}</td>
                </tr>
                <tr>
                    <td colSpan="2" style={{ 'border': 'none' }}>
                        {field}
                    </td>
                </tr>
            </Fragment>
        )
    }
}
class TypeSize extends Component {
    render() {
        return (
            <tr>
                <td>Type: {this.props.file.mediaType.value}</td>
                <td className="text-right">Size: {convertSize(this.props.file.size)}</td>
            </tr>    
        )
    }
}