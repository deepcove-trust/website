import React, { Component } from 'react';

export default class Notice extends Component {
    getClassNames(i) {
        return (`notice ${i ? 'important' : ''}`).trim();
    }

    getReadableDate(d) {
        return new Date(d).toDateString();
    }

    render() {
        const { notice, important } = this.props;

        return (
            <div className={this.getClassNames(important)}>
                <h4>{notice.title}</h4>
                <small>{this.getReadableDate(notice.updated_at)}</small>
                <p>{notice.short_desc}</p>
            </div>
        )
    }
}