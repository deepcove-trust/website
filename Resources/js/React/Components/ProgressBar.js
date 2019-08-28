import React, { Component } from 'react';

export default class ProgressBar extends Component {

    getColor() { return `bg-${this.props.color}`; }
    

    render() {
        return (
            <div className="progress" style={{ 'margin': '-1rem -1rem 1rem -1rem', 'borderRadius': '0px' }}>
                <div className={`progress ${this.getColor()}`}
                    style={{ 'width': this.props.progress + '%' }} />
            </div>
        )
    }
}