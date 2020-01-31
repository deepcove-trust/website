import React, { Component, Fragment } from 'react';
import PhonePreview from '../../Components/PhonePreview';
import NoticeboardSection from './NoticeboardSection';
import { NoticeCard, NoticeSummary } from './Notice';
import { Button } from '../../Components/Button';

export default class NoticesOverview extends Component {
    render() {
        const { important, normal, disabled } = this.props;

        let important_notices = important.map((notice, key) => {
            return <NoticeCard notice={notice} key={key} important />
        });

        let normal_notices = normal.map((notice, key) => {
            return <NoticeCard notice={notice} key={key} />
        });

        let list_important = important.map((notice, key) => {
            return <NoticeSummary notice={notice} key={`imp_${key}`} cb_edit={this.props.cb_edit} />
        });

        let list_normal = normal.map((notice, key) => {
            return <NoticeSummary notice={notice} key={`norm_${key}`} cb_edit={this.props.cb_edit} />
        });

        let list_disabled = disabled.map((notice, key) => {
            return <NoticeSummary notice={notice} key={`dis_${key}`} cb_edit={this.props.cb_edit} />;
        });

        return (
            <Fragment>
                <div className="col-md-8 col-sm-12">
                    <Button className="btn btn-dark ml-auto mr-0 d-block mb-3" cb={this.props.cb_edit.bind(this, 1, null)}>
                        New Notice <i className="fas fa-plus" />
                    </Button>

                    {list_important}
                    {list_normal}
                    {list_disabled}
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