import React, { Component, Fragment } from 'react';
import PhonePreview from '../../Components/PhonePreview';
import NoticeboardSection from './NoticeboardSection';
import { NoticeCard, NoticeSummary } from './Notice';
import { Button } from '../../Components/Button';
import Card, { CardBody, CardHighlight } from '../../Components/Card';

export default class NoticesOverview extends Component {
    render() {
        const { important, normal, disabled } = this.props;

        let important_notices = important.map((notice, key) => {
            return <NoticeCard notice={notice} key={key} cb_edit={this.props.cb_edit} important />
        });

        let normal_notices = normal.map((notice, key) => {
            return <NoticeCard notice={notice} key={key} cb_edit={this.props.cb_edit} />
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
                <div className="col-md-7 col-sm-12">
                    <Card>
                        <CardHighlight>
                            <h3 className="pt-3 pb-2 mb-0 d-inline-block">Current Notices</h3>

                            <Button className="btn btn-dark float-right m-2" cb={this.props.cb_edit.bind(this, 1, null)}>
                                New Notice <i className="fas fa-plus" />
                            </Button>
                        </CardHighlight>

                        <CardBody>
                            {list_important}
                            {list_normal}
                            {list_disabled}
                        </CardBody>
                    </Card>
                </div>

                <div className="col-md-5 col-sm-12">
                    <PhonePreview sticky>
                        <div className="h-100">
                            <div className="preview-body with-back-button">
                                <div>
                                    <NoticeboardSection title="Important Notices">
                                        {important_notices}
                                    </NoticeboardSection>

                                    <NoticeboardSection title="General Notices">
                                        {normal_notices}
                                    </NoticeboardSection>
                                </div>
                            </div>
                            <div className="back-button-bar">Back</div>
                        </div>
                    </PhonePreview>
                </div>
            </Fragment>
        )
    }
}