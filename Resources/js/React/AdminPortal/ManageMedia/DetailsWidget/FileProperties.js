import React, { Component, Fragment } from 'react';
import { Input } from '../../../Components/FormControl';
import { CardHighlight, CardBody } from '../../../Components/Card';

export default class FileProperties extends Component {
    render() {

        var title = this.props.file.mediaType.category + ' Properties';

        return (
            <Fragment>
                <CardHighlight>
                    <h3 className="pt-3">{title}</h3>
                </CardHighlight>

                <CardBody>
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

                                <Duration file={this.props.file} />
                            </tbody>
                        </table>
                    </div>
                </CardBody>
            </Fragment>
        )
    }
}

class AltText extends Component {
    render() {
        if (!this.props.file.mediaType.mime.includes("image/")) return <div />

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
        if (!this.props.file.mediaType.mime.includes("image/")) return null;

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

class Duration extends Component {
    render() {
        if (!this.props.file.mediaType.mime.includes("audio/")) return null;

        return (
            <tr>
                <td>Duration</td>
                <td>{this.props.file.duration} seconds</td>
            </tr>
        )
    }
}