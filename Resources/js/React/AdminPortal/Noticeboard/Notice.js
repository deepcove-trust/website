import React, { Component } from 'react';
import { Button } from '../../Components/Button';

export class NoticeCard extends Component {
    getClassNames(i) {
        return (`notice ${i ? 'important' : ''}`).trim();
    }

    getReadableDate(d) {
        return new Date(d).toDateString();
    }

    render() {
        const { notice, important } = this.props;

        return (
            <div className={`text-left ${this.getClassNames(important)} pointer`} onClick={this.props.cb_edit.bind(this, 1, this.props.notice)}>
                <h4>{notice.title}</h4>
                <small>{this.getReadableDate(notice.updated_at)}</small>
                <p>{notice.short_desc}</p>
            </div>
        )
    }
}
export class NoticeSummary extends Component {
    getReadableDate(d) {
        return new Date(d).toDateString();
    }

    render() {
        const { id, noticeboard, active, urgent, title, short_desc, updated_at } = this.props.notice;

        // Notice Status
        let important = urgent ? <span className="text-danger px-1">URGENT</span> : null;
        let disabled = !active ? <span className="text-danger px-1">DISABLED</span> : null;
        let status = !!important || !!disabled ? <p className="font-weight-bold">Status: {important}{disabled}</p> : null;

        //Platforms
        let app = !noticeboard.includes("app") ? <i className="fad fa-browser fa-2x mr-2" key='web' /> : null;
        let web = !noticeboard.includes("web") ? <i className="fab fa-android fa-2x mr-2" key='app' /> : null;
        

        return (
            <div>
                <small className="float-right">{this.getReadableDate(updated_at)}</small>
                <h4>{title}</h4>
                <p>{short_desc}</p>
                {status}
                <p className="font-weight-bold">Platforms:</p> {app} {web}
                
                <Button className="btn btn-dark float-right" cb={this.props.cb_edit.bind(this, 1, this.props.notice)}>
                    Edit <i className="fa fa-pencil" />
                </Button>
                <hr />
            </div>
        );
    }
}