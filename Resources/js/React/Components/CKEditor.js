import React, { Component } from 'react';
import CKEditor from 'ckeditor4-react';
CKEditor.editorUrl = '/ckeditor/ckeditor.js';

class TwoWayBinding extends Component {
    constructor(props) {
        super(props);

        this.state = {
            data: '<p>React is really <em>nice</em>!</p>'
        };

        this.handleChange = this.handleChange.bind(this);
        this.onEditorChange = this.onEditorChange.bind(this);
    }

    onEditorChange(evt) {
        this.setState({
            data: evt.editor.getData()
        });
    }

    handleChange(changeEvent) {
        this.setState({
            data: changeEvent.target.value
        });
    }

    render() {
        return (
            <div>
                <CKEditor
                    data={this.state.data}
                    onChange={this.onEditorChange}
                    config={this.config}/>
            </div>
        );
    }
}

export default TwoWayBinding;