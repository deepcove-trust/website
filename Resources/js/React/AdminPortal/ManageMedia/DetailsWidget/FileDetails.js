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
    update(source, showCopyright) {
        this.props.cb({
            info: source || "",
            showCopyright: showCopyright || false
        });
    }

    render() {
        let source = this.props.file.source || { info: "", showCopyright: false };
        let field = source.showCopyright ? <span>&copy; {source.info}</span> : <span>{source.info}</span>

        if (this.props.edit) {
            field = (
                <Input type="text"
                    value={source.info}
                    cb={(x) => {
                        this.update(x, source.showCopyright)
                    }}
                />
            )
        }

        let toggle;
        if (this.props.edit) {
            toggle = (
                <Checkbox checked={source.showCopyright}
                    label="Show Copyright Symbol?"
                    labelAlign="left"
                    cb={(x) => {
                        console.log(x)
                        this.update(source.info, x)
                    }}
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