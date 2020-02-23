import React, { Component, Fragment } from 'react';
import { Button } from '../../../Components/Button';
import Delete from './Delete';
import { CardBody } from '../../../Components/Card';

export default class MetaButtons extends Component {
    constructor(props) {
        super(props);

        this.state = {
            cbCopied: 0
        }
    }

    _handleClipboadCopy() {
        var el = document.createElement("textarea");
        // to avoid breaking orgain page when copying more words
        document.body.appendChild(el);
        //Be careful if you use texarea. setAttribute('value', value),
        // which works with "input" does not work with "textarea".– Eduard
        el.value = `/media?filename=${this.props.fileName}&download=true&original=true`;
        el.select();
        document.execCommand("copy");
        document.body.removeChild(el);

        // Change the copy button
        // to show 'COPIED'
        this.setState({
            cbCopied: 2
        }, () => {
            // When the timer runs out 
            // go back to copy text
            setInterval(() => {
                this.setState({
                    cbCopied: this.state.cbCopied - 1
                }, () => {
                    if (this.state.cbCopied <= 0) {
                        clearTimeout();
                    }
                });
            }, 1000);
        });
    }

    render() {
        let copyBtnText = this.state.cbCopied > 0 ? 'Copied' : <span>Copy URL <i className="fas fa-clipboard"/></span>

        let controls = !this.props.edit ? (
            <Fragment>
                <div className="col-md-4 col-sm-12">
                    <Button className="btn btn-dark btn-sm btn-block" cb={this.props.setEdit.bind(this, true)}>
                        Edit Details
                    </Button>
                </div>

                <div className="col-md-4 col-sm-12">
                    <Button className="btn btn-dark btn-sm btn-block" disabled>
                        Crop Image  <i className="far fa-crop" />
                    </Button>
                </div>

                <div className="col-md-4 col-sm-12">
                    <Delete text="Delete" id={this.props.fileId || this.props.file.id || null}
                        className="btn btn-danger btn-sm btn-block" alert={this.props.alert} cb={this.props.deleteCb}
                    />
                </div>
            </Fragment>
        ) : (
            <Fragment>
                <div className="col-md-4 offset-md-4 col-sm-12 text-right">
                    <Button className="btn btn-dark btn-sm" cb={this.props.cancel}>
                        Cancel  <i className="fas fa-times" />
                    </Button>
                </div>

                <div className="col-md-4 col-sm-12">
                        <Button className="btn btn-info btn-sm" cb={this.props.saveChanges} pending={this.props.pending}>
                        Save <i className="fas fa-check" />
                    </Button>
                </div>
            </Fragment>
        )
        
        return (
            <CardBody className="card-body bg-white text-center sticky-top">
                <div className="row">
                    {controls}

                    <div className="col-md-4 col-sm-12 text-center mt-2">
                        <Button className="btn btn-dark btn-sm btn-block" cb={this._handleClipboadCopy.bind(this)}>
                            {copyBtnText}
                        </Button>
                    </div>

                    <div className="col-md-4 offset-md-4 col-sm-12 text-center mt-2">
                        <a className="btn btn-dark btn-sm btn-block" href={`/media?filename=${this.props.fileName}&download=true&original=true`}>
                            Download File <i className="fas fa-download" />
                        </a>
                    </div>
                </div>
            </CardBody>
        )
    }
}