import React, { Component } from 'react'

export default class ProgressBar extends Component {
    render() {
        return (
            <div className="progress" style={{ 'margin': '-1rem -1rem 1rem -1rem', 'borderRadius': '0px' }}>
                <div className="progress-bar bg-info"
                    style={{ 'width': this.props.progress + '%' }} />
            </div>
        )
    }
}
