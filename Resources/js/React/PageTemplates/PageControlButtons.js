import React, { Component, Fragment } from 'react';
import { Button } from '../Components/Button';

export class ToggleVisibility extends Component {
    render() {
        let text = (
            <Fragment>
                Make Public <i className="fas fa-eye" />
            </Fragment>
        )

        if (this.props.public) {
            text = (
                <Fragment>
                    Make Private <i className="fas fa-eye-slash"/>
                </Fragment>
            )
        }

        return (
            <Button className={this.props.className || `btn btn-dark btn-sm`}>
                {text}
            </Button>    
        )
    }
}