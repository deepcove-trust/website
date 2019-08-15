import React, { Component, Fragment } from 'react';
import TextBlockLink from './Link';
import { FormGroup, Input, TextArea } from '../Components/FormControl';


export default class TextBlock extends Component {
    constructor(props) {
        super(props);

        this.state = {
            content: {
                title: null,
                text: null,
                link: {
                    align: null,
                    href: null,
                    isButton: false,
                    text: null
                }
            }//this.props.content
        }
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.content && nextProps.content != this.state.content) {
            this.setState({
                content: nextProps.content
            });
        }
    }

    render() {
        let heading;
        if (this.state.content.heading) {
            heading = <h6>{this.state.content.heading}</h6>
        }

        let link;
        if (this.state.content.link) {
            link = <TextBlockLink link={this.state.content.link} />
        }

        return (
            <Fragment>
                {heading}
                <p>{this.state.content.text}</p>
                {link}
            </Fragment>
        )
    }
}