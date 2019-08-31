import React, { Component } from 'react';
import CKEditor from 'ckeditor4-react';
CKEditor.editorUrl = '/ckeditor/ckeditor.js';

class TwoWayBinding extends Component {
    constructor(props) {
        super(props);

        this.state = {
            data: this.props.value
        };
        this.handleChange = this.handleChange.bind(this);
        this.onEditorChange = this.onEditorChange.bind(this);
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.value != this.state.data) {
            this.setState({
                data: nextProps.value
            });
        }
    }

    onEditorChange(evt) {
        if (this.props.cb) {
            this.props.cb(evt.editor.getData());
        }

        this.setState({
            data: evt.editor.getData()
        });
    }

    handleChange(changeEvent) {
        if (this.props.cb) {
            this.props.cb(changeEvent.target.value);
        }

        this.setState({
            data: changeEvent.target.value
        });
    }

    render() {

        return (
            <div>
                <CKEditor
                    id={this.props.id}
                    data={this.state.data}
                    onChange={this.onEditorChange}
                    config={this.config} />
            </div>
        );
    }
}

export default TwoWayBinding;