import React, { Component, Fragment } from 'react';
import Panel from '../../../Components/Panel';

export default class FileUsages extends Component {

    render() {

        let usages = this.props.usages;

        let activities = usages.Activities ? <UsageSection title="Guided Walk Activities" usages={usages.Activities} /> : null;

        let factfileentries = usages.FactFileEntries ? <UsageSection title="Fact Files" usages={usages.FactFileEntries} /> : null;

        let quizzes = usages.Quizzes ? <UsageSection title="Quizzes" usages={usages.Quizzes} /> : null;

        let pages = usages.Pages ? <UsageSection title="Website Pages" usages={usages.Pages} /> : null;

        let noUsages = !(quizzes || factfileentries || activities) ? <p className="font-weight-bold text-center">No usages</p> : null;

        return (
            <Panel>
                <h4 className="text-center">Usages</h4>

                <hr />

                {pages}
                {activities}
                {factfileentries}
                {quizzes}
                {noUsages}

            </Panel>
        )
    }
}

class UsageSection extends Component {
    render() {
        return (
            <Fragment>
                <div className="row">
                    <div className="col-6">
                        <h5>{this.props.title}</h5>
                    </div>
                    <div className="col-6">
                        {this.props.usages.map(quiz => { return <p>{quiz}</p> })}
                    </div>
                </div>
                <hr />
            </Fragment >
        )
    }
}