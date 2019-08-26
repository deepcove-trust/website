import React, { Component } from 'react'

export default class ProgressBar extends Component {
    render() {
        return (
            <div className="progress" style={{ 'margin': '-1rem -1rem 1rem -1rem', 'border-radius': '0px' }}>
                <div className="progress-bar progress-bar-striped progress-bar-animated bg-info"
                    style={{ 'width': this.props.progress * 33.33 + '%' }} />
            </div>
        )
    }
}
