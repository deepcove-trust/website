import React, { Component } from "react";

export default class TwoWayBinding extends Component {
    constructor(props) {
        super(props);
        this.elementName = "editor_" + this.props.id;
        this.componentDidMount = this.componentDidMount.bind(this);
    }

    render() {
        return (
            <textarea name={this.elementName} defaultValue={this.props.value}></textarea>
        )
    }

    componentDidMount() {
        let configuration = {
            toolbar: "Basic"
        };
        CKEDITOR.replace(this.elementName, configuration);
        CKEDITOR.instances[this.elementName].on("change", function () {
            let data = CKEDITOR.instances[this.elementName].getData();
            this.props.cb(data);
        }.bind(this));
    }

    componentWillUnmount() {
        CKEDITOR.instances[this.elementName].destroy();
    }
}