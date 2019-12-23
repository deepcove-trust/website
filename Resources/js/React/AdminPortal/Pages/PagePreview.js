import React, { Component } from 'react';
import PreviewCard from './PreviewCard';
import { ConfirmModal } from '../../Components/Button';
import { ToggleVisibility, ViewPage, EditPageSettings } from '../../PageTemplates/PageControlButtons';
import ReactTooltip from 'react-tooltip'
import $ from 'jquery';
import Alert from '../../Components/Alert';

export default class PagePreview extends Component {
    render() {
        return (
            <PreviewCard className="mb-2" title={this.props.page.name || "Home"} imgurl={`/images/templates/${this.props.page.template.id}.png`}>
                <PageStatus page={this.props.page} />

                <div className="row">
                    <div className="col-md-6 col-sm-12 pb-2 px-1">
                        <ViewPage href={`/${this.props.page.absoluteUrl}`} />
                    </div>

                    <div className="col-md-6 col-sm-12 pb-2 px-1">
                        <EditPageSettings pageId={this.props.page.id} />
                    </div>

                    <div className="col-md-6 col-sm-12 pb-2 px-1">

                        <ToggleVisibility page={this.props.page}
                            className="btn btn-outline-dark btn-block"
                            public={this.props.page.public}
                            pageId={this.props.page.id}
                            alert={this.props.alert}
                            u={this.props.u}
                        />
                    </div>

                    <div className="col-md-6 col-sm-12 px-1">
                        <DeletePage page={this.props.page}
                            className="btn btn-outline-dark btn-block"
                            u={this.props.u} />
                    </div>
                </div>

                <ReactTooltip />
            </PreviewCard>
        )
    }
}

class DeletePage extends Component {
    deletePage() {
        $.ajax({
            type: 'delete',
            url: `/admin/pages/${this.props.page.id}`
        }).done(() => {
            this.Alert.success(`${this.props.page.name} has been deleted`);
            this.props.u();
        }).fail((err) => {
            this.Alert.error(null, err.responseText);
        });
    }

    render() {
        
        return (
            <Alert onRef={ref => (this.Alert = ref)}>
                <ConfirmModal id={this.props.page.id}
                    question="delete page"
                    className="btn btn-outline-danger btn-block"
                    explanation="This action cannot be undone, all information will be lost"
                    actionText="YES Delete Page!"
                    confirmPhrase={this.props.page.name}
                    cb={this.deletePage.bind(this)} >
                        Delete <i className="fas fa-exclamation-triangle"/>
                </ConfirmModal>
            </Alert>
        );
    }
}

class PageStatus extends Component {
    render() {
        let noDescriptionMsg = "To improve your search engine results please provide a page description by clicking on the 'Edit Settings' button."
        let visibility = !this.props.page.public ? <span className="text-danger">Private Page</span> : <span className="text-success">Public Page</span>
        let description = !this.props.page.description ? <span className="text-danger" data-tip={noDescriptionMsg}>No Description</span> : <span className="text-success" data-tip={this.props.page.description}>Valid Description</span>;

        return (
            <React.Fragment>
                <hr />
                    <div className="row text-center font-weight-bold">
                        <div className="col-md-6 col-sm-12">
                            {visibility}
                        </div>

                        <div className="col-md-6 col-sm-12">
                        {description}
                        </div>
                    </div>
                <hr/>
            </React.Fragment>
        );
    }
}