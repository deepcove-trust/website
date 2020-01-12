import React, { Component, Fragment } from 'react';
import PhonePreview from '../../Components/PhonePreview';
import NoticeboardSection from './NoticeboardSection';
import Notice from './Notice';

export default class NoticesOverview extends Component {
    render() {
        const { important, normal } = this.props;

        let important_notices = important.map((notice, key) => {
            return <Notice notice={notice} key={key} important />
        });

        let normal_notices = normal.map((notice, key) => {
            return <Notice notice={notice} key={key} />
        });


        return (
            <Fragment>
                <div className="col-md-8 col-sm-12">
                    <div className="row">
   
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