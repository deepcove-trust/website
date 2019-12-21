import React, { Component, Fragment } from 'react';
import AvaliablePages from './AvaliablePages';
import Title from './Title';
import Page from './Page';

export class Section extends Component {
    render() {
        let pages = this.props.section ? (
            this.props.section.pages.map((page, key) => {
                return <Page page={page} key={key}
                    alert={this.props.alert}
                    baseUri={this.props.baseUri}
                    u={this.props.u}
                />
            })
        ) : null;
        
        return (
            <Fragment>
                <Title section={this.props.section}
                    sectionId={this.props.sectionId}
                    baseUri={this.props.baseUri}
                    alert={this.props.alert}
                    u={this.props.u}
                />

                <AvaliablePages pages={this.props.avaliable}
                    sectionId={this.props.sectionId}
                    baseUri={this.props.baseUri}
                    alert={this.props.alert}
                    u={this.props.u}
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