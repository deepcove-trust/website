﻿import React, { Component } from 'react';
import Panel from '../../Components/Panel';

export default class PreviewCard extends Component {
    render() {
        return (
            <Panel className={this.props.className || null} style={{'paddingBottom': '0.5rem'}}>
                <div style={{ 'margin': '-1rem -1rem 2rem -1rem' }}>
                    <img src={this.props.imgurl || "https://via.placeholder.com/150"} style={{ 'width': '100%', 'maxHeight': '300px' }} />
                </div>

                <h4 className="text-center pb-2">{this.props.title}</h4>

                {this.props.children}
            </Panel>
        )
    }
}