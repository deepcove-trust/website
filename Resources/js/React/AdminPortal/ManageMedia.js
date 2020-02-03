import React, { Component } from 'react';
import { render } from 'react-dom';
import Gallery from './ManageMedia/Gallery';
import Details from './ManageMedia/Details';
import Upload from './ManageMedia/Upload';
import Alert from '../Components/Alert';
import ErrorBoundary from '../Errors/ErrorBoundary';

const sections = {
    1: Gallery,
    2: Details,
    3: Upload
}

export default class ManageMedia extends Component {
    constructor(props) {
        super(props);

        this.state = {
            tab: 1
        }
    }

    componentDidMount() {
        this.setState({});
    }

    render() {
        const Template = sections[this.state.tab];

        return (
            <ErrorBoundary customError="react-manage-media">
                <Alert onRef={ref => this.Alert = ref}>
                    <div className="row">
                        <div className="col-12 fade1sec">
                            <Template data={this.state.media || null}
                                alert={this.Alert}
                                setTab={(tab) => this.setState({
                                    tab
                                })
                                }
                                viewDetails={(media) => this.setState({
                                    tab: 2,
                                    media
                                })
                                } />
                        </div>
                    </div>
                </Alert>
            </ErrorBoundary>
        )
    }
}

if (document.getElementById('react_ManageMedia'))
    render(<ManageMedia />, document.getElementById('react_ManageMedia'));    