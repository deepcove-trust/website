import React, { Component, Fragment } from 'react';
import PhonePreview from '../../Components/PhonePreview';
import NoticeboardSection from './NoticeboardSection';
import Notice from './Notice';

export default class Editor extends Component {
    constructor(props) {
        super(props);

        this.state = {
            data: this.props.selected || {
                title: "",
                updated_at: "",
                long_desc: ""
            }
        };
    }

    componentDidUpdate() {
        if (this.state.data == this.props.selected) return;

        this.setState({
            data: this.props.selected
        });
    }

    getReadableDate(d) {
        return new Date(d).toDateString();
    }

    render() {
        console.log(this.props.selected)
        return (
            <Fragment>
                <div className="col-md-8 col-sm-12">
                    <div className="row">

                    </div>
                </div>

                <div className="col-md-4 col-sm-12">
                    <PhonePreview>
                        <h4 className="text-center">{this.state.data.title}</h4>
                        <small className="d-block text-center">{this.getReadableDate(this.state.data.updated_at)}</small>
                        <hr className="indented" />
                        <p className="indented">{this.state.data.long_desc}</p>
                        <NoticeboardSection title="Back" />
                    </PhonePreview>
                </div>
            </Fragment>
        )
    }
}