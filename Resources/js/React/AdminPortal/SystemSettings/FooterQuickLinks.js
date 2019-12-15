import React, { Component } from 'react';
import { Section } from './FooterQuickLinks/Section';
import AlertWrapper from '../../Components/Alert';
import $ from 'jquery';

const baseUri = "/admin/settings/quicklinks";

export default class FooterQuickLinks extends Component {
    constructor(props) {
        super(props);

        this.state = {
            quickLinks: { a: null, b: null, avaliable: null },
            default: null,
        }
    }

    componentDidMount() {
        this.getData();
    }

    addQuickLink(sectionId, pageId) {
        $.ajax({
            type: 'post',
            url: `${baseUri}/${pageId}/${sectionId}`
        }).done(() => {
            this.Alert.alert('success', 'Quick link added');
            this.getData();
        }).fail((err) => {
            this.Alert.responseAlert('error', $.parseJSON(err.responseText));
        });
    }

    getData() {
        $.ajax({
            method: 'get',
            url: baseUri
        }).done((quickLinks) => {
            this.setState({
                quickLinks: _.cloneDeep(quickLinks),
                default: _.cloneDeep(quickLinks)
            });
        }); 
    }

    removeQuickLink(pageId) {
        $.ajax({
            method: 'delete',
            url: `${baseUri}/${pageId}`
        }).done(() => {
            this.setState({
                pending: false
            }, () => {
                this.Alert.alert('success', 'Quick link deleted');
                this.getData();
            });
        }).fail((err) => {
            this.Alert.responseAlert('error', $.parseJSON(err.responseText));
        });
    }

    updateTitle(sectionId, title) {
        $.ajax({
            type: 'put',
            url: `${baseUri}/${sectionId}`,
            data: { title: title }
        }).done(() => {
            this.Alert.alert('success', 'Quick link section updated')
            this.getData();
        }).fail((err) => {
            this.Alert.responseAlert('error', $.parseJSON(err.responseText));
        });
    }
    
    render() {
        return (
            <AlertWrapper onRef={ref => (this.Alert = ref)}>
                <div className="row">
                    <div className="col-lg-6 col-md-12">
                        <Section section={this.state.quickLinks.a || null}
                            avaliable={this.state.quickLinks.avaliable || null}
                            addLinkCb={this.addQuickLink.bind(this, 1)}//Enum ID = QuickLinks.A
                            removeLinkCb={this.removeQuickLink.bind(this)}
                            updateTitleCb={this.updateTitle.bind(this, 1)}//Enum ID = QuickLinks.A
                        />
                    </div>

                    <div className="col-lg-6 col-md-12">
                        <Section section={this.state.quickLinks.b || null}
                            avaliable={this.state.quickLinks.avaliable || null}
                            addLinkCb={this.addQuickLink.bind(this, 2)}//Enum ID = QuickLinks.B
                            removeLinkCb={this.removeQuickLink.bind(this)}
                            updateTitleCb={this.updateTitle.bind(this, 2)}//Enum ID = QuickLinks.B
                        />
                    </div>
                </div>
            </AlertWrapper>
        )
    }
}