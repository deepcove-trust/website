import React, { Component, Fragment } from 'react';
import { Input } from '../../../Components/FormControl';
import Panel from '../../../Components/Panel';

export default class FileProperties extends Component {
    render() {

        var title = this.props.file.mediaType.category + ' Properties';

        return (
            <Panel>
                <h4 className="text-center">{title}</h4>

                <div className="table-responsive">
                    <table className="table table-sm">
                        <tbody>
                            <Title edit={this.props.edit}
                                file={this.props.file}
                                cb={this.props.cb.bind(this, 'title')}
                            />

                            <AltText edit={this.props.edit}
                                file={this.props.file}
                                cb={this.props.cb.bind(this, 'alt')}
                            />

                            <Dimensions file={this.props.file} />
                        </tbody>
                    </table>
                </div>
            </Panel>
        )
    }
}

class AltText extends Component {
    render() {
        let field = <Fragment>{this.props.file.alt}</Fragment>
        if (this.props.edit) {
            field = (
                <Input type="text"
                    value={this.props.file.alt}
                    cb={this.props.cb}
                />
            )
        }

        return (
            <tr>
                <td>Alt-Text:</td>
                <td>{field}</td>
            </tr>
        )
    }
}

class Title extends Component {
    render() {
        let field = <Fragment>{this.props.file.title}</Fragment>
        if (this.props.edit) {
            field = (
                <Input type="text"
                    value={this.props.file.title}
                    cb={this.props.cb}
                />
            )
        }

        return (
            <tr>
                <td>Title:</td>
                <td>{field}</td>
            </tr>
        )
    }
}

class Dimensions extends Component {
    render() {
        return (
            <tr>
                <td>Dimensions:</td>
                <td>
                    {this.props.file.height || 0}px  x {this.props.file.width || 0}px
                </td>
            </tr>
        )
    }
}