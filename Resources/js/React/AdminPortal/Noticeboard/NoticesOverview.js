import React, { Component, Fragment } from 'react';
import PhonePreview from '../../Components/PhonePreview';
import NoticeboardSection from './NoticeboardSection';
import Notice from './Notice';

export default class NoticesOverview extends Component {
    render() {
        const { important, normal, disabled } = this.props;

        let important_notices = important.map((notice, key) => {
            return <Notice notice={notice} key={key} important />
        });

        let normal_notices = normal.map((notice, key) => {
            return <Notice notice={notice} key={key} />
        });

        let notice_list = important.map((notice, key) => {
            return notice.title;
        });

        notice_list += normal.map((notice, key) => {
            return notice.title;
        });

        notice_list += disabled.map((notice, key) => {
            return notice.title;
        });


        return (
            <Fragment>
                <div className="col-md-8 col-sm-12">
                    <div className="row">
                        {notice_list}
                    </div>
                </div>

                <div className="col-md-4 col-sm-12">
                    <PhonePreview>
                        <NoticeboardSection title="Important Notices">
                            {important_notices}
                        </NoticeboardSection>

                        <NoticeboardSection title="Other Notices">
                            {normal_notices}
                        </NoticeboardSection>

                        <NoticeboardSection title="Back" />
                    </PhonePreview>
                </div>
            </Fragment>
        )
    }
}