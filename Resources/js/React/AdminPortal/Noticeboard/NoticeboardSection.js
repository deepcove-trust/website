import React, { Component, Fragment } from 'react';

export default class NoticeboardSection extends Component {
    render() {
        return (
            <Fragment>
                <h4 className="noticeboardSection">{this.props.title}</h4>
                {this.props.children}
            </Fragment>
        )
    }
}