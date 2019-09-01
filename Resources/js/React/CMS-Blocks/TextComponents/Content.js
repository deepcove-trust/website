import React, { Component } from 'react';
import { CKEditor } from '../../Components/FormControl';


export default class Content extends Component {
    render() {
        if (!this.props.edit)
            return <div dangerouslySetInnerHTML={{ __html: this.props.content }}></div>;

        return (
            <CKEditor id={this.props.id} value={this.props.content} cb={this.props.updateVal} />
        )
    }
}