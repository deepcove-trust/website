import React, { Component, Fragment } from 'react';
import AvaliablePages from './AvaliablePages';
import Title from './Title';
import Page from './Page';

export class Section extends Component {
    render() {  
        let pages = this.props.section ? (
            this.props.section.pages.map((page, key) => {
                return <Page page={page} key={key}
                    removeLinkCb={this.props.removeLinkCb}
                />
            })
        ) : null;

        return (
            <Fragment>
                <Title section={this.props.section}
                    sectionId={this.props.sectionId}
                    updateTitleCb={this.props.updateTitleCb}
                />

                <AvaliablePages pages={this.props.avaliable}
                    addLinkCb={this.props.addLinkCb}
                />

                <div className="table-responsive-md">
                    <table className="table table-hover table-sm">
                        <tbody>
                            {pages}
                        </tbody>
                    </table>
                </div>
            </Fragment>
        )
    }
}