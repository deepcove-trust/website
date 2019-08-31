import React, { Component, Fragment } from 'react';
import ReactTemplate1 from './1';
import ReactTemplate2 from './2';
import $ from 'jQuery';

const components =
    [
        ReactTemplate1,
        ReactTemplate2,
    ];

export default class ReactTemplate extends Component {

    constructor(props) {
        super(props);

        this.state = {
            pageId: null,
            targetRevision: null,
            editMode: false,
            page: null
        };
    }

    componentDidMount() {
        this.setState({
            pageId: document.getElementById('react_template').getAttribute("data-pageid")
        }, this.getData());
    }

    getData() {
        // AJAX CALL TO GET SPECIFIC PAGE REVISION
        // WE PROVIDE THE REVISION ID IF WE CARE ABOUT A SPECIFIC VERSION
        // OTHERWISE WE DON'T PROVIDE THE ID AND GET LATEST
    }

    render() {

        //let Template = components[]

        return (

            <PageControls />

        );
    }

}

if (document.getElementById('react_template'))
    render(<ReactTemplate />, document.getElementById('react_template'));    