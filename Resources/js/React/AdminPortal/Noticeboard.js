import React, { Component } from 'react';
import { render } from 'react-dom';
import Alert from '../Components/Alert';
import PhonePreview from '../Components/PhonePreview';
import Notice from './Noticeboard/Notice';
import NoticeboardSection from './Noticeboard/NoticeboardSection';
import $ from 'jquery';

const baseUri = `/admin/noticeboard`;

class Noticeboard extends Component {
    constructor(props) {
        super(props);

        this.state = {
            important: [],
            normal: [],
            disabled: []
        }
    }

    componentDidMount() { this.getData(); }

    getData() {
        $.ajax({
            method: 'get',
            url: `${baseUri}/data`
        }).done((notice) => {
            this.setState({
                important: notice.important,
                normal: notice.normal,
                disabled: notice.disabled
            });
        }).fail((err) => {
            console.log(err);
        });
    }

    render() {
        let important = this.state.important.map((notice, key) => {
            return <Notice notice={notice} key={key} important />
        });

        let normal = this.state.normal.map((notice, key) => {
            return <Notice notice={notice} key={key} />
        });

        return (
            <Alert className="row" onRef={ref => (this.Alert = ref)}>
                <div className="col-12">
                    <h1 className="text-center">Noticeboard</h1>
                </div>

                <div className="col-md-8 col-sm-12">
                    //content
                </div>

                <div className="col-md-4 col-sm-12">
                    <PhonePreview>
                        <NoticeboardSection title="Important Notices">
                            {important}
                        </NoticeboardSection>

                        <NoticeboardSection title="Other Notices">
                            {normal}
                        </NoticeboardSection>

                        <NoticeboardSection title="Back" />
                    </PhonePreview>
                </div>
            </Alert>
        )
    }
}

if (document.getElementById('react_Noticeboard'))
    render(<Noticeboard />, document.getElementById('react_Noticeboard'));