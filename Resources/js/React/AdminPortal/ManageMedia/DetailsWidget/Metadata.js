import React, { Component, Fragment } from 'react';
import { Button } from '../../../Components/Button';

export default class MetaData extends Component {
    constructor(props) {
        super(props);

        this.state = {
            edit: false
        }
    }

    render() {
        return (
            <Fragment>
                <h3>Detials</h3>
                <dl>
                    <dt>Name:</dt>
                    <dd>{this.props.file.name}.{this.props.file.mediaType.value.toLowerCase()}</dd>

                    <dt>Size on Disk (Includes all Versions):</dt>
                    <dd>.</dd>

                    <dt>Source</dt>
                    <dd>.</dd>
                </dl>

                <EditButtons editMode={this.state.edit}
                    setEditMode={() => {
                        this.setState({
                            edit: true
                        })
                    }}

                    save={null}
                    reset={null}
                />
            </Fragment>
        )
    }
}

class EditButtons extends Component {
    render() {
        if (this.props.editMode) {
            return (
                <Fragment>
                    <Button className="btn btn-danger btn-sm mx-1" cb={this.props.reset}>
                        Edit Details <i className="fas fa-times" />
                    </Button>
                    <Button className="btn btn-success btn-sm mx-1" cb={this.props.save}>
                        Edit Details <i className="fas fa-check" />
                    </Button>
                </Fragment>
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