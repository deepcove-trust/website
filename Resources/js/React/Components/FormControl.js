import React, { Component } from 'react';


export class FormGroup extends Component {
    render() {
        return (
            <div className="form-group">
                {this.props.children}
            </div>
        )
    }
}

export class Input extends Component {
    constructor(props) {
        super(props);
        this.state = {value: this.props.value}
    }

    handleChange(e) {
        this.setState({ value: e.target.value });

        // Send the value to the (optional) callback
        if (this.props.cb)
            this.props.cb(e.target.value);
    }

    getAutoComplete() {
        switch (this.props.autoComplete) {
            case "name":
                return "name";
            case "email":
                return "email";
            case "phone":
                return "tel";
            case "password":
                return "current-password";
            case "newpassword":
                return "new-password";
            case "off":
                return "off"; 
            default:
                return "on";
        }
    }

    getClass() {
        return this.props.inputClass || "form-control";
    }

    getType() {
        if (!this.props.type)
            throw 'You must provide a type for the input field';

        switch (this.props.type) {
            case "date":
                return "datetime-local";
            case "email":
                return "email";
            case "file":
                return "file";
            case "image":
                return "image";
            case "password":
                return "password";
            default:
                return "text";
        }
    }

    isDisabled() {
        return this.props.disabled;
    }

    isReadOnly() {
        return this.props.readonly;
    }

    isRequired() {
        return this.props.required;
    }

    componentWillReceiveProps(nextProps) {
        if (this.state.value != nextProps.value)
            this.setState({ value: nextProps.value });
    }
  
    
    render() {
        let id = this.props.id || false;
        let name = this.props.name || false;
        let placeholder = this.props.placeholder || false;

        return (
            <input id={id} type={this.getType()} className={this.getClass()} name={name} value={this.state.value} placeholder={placeholder} autocomplete={this.getAutoComplete()} disabled={this.isDisabled()} readonly={this.isReadOnly()} required={this.isRequired()} onChange={this.handleChange.bind(this)} />
        )
    }
}

export class Select extends Component {
    constructor(props) {
        super(props);
        this.state = { value: this.props.value }
    }

    handleChange(e) {
        this.setState({ value: e.target.value });

        // Send the value to the (optional) callback
        if (this.props.cb)
            this.props.cb(e.target.value);
    }

    getClass() {
        return this.props.inputClass || "form-control";
    }

    isDisabled() {
        return this.props.disabled;
    }

    isReadOnly() {
        return this.props.readonly;
    }

    isRequired() {
        return this.props.required;
    }

    componentWillReceiveProps(nextProps) {
        if (this.state.value != nextProps.value)
            this.setState({ value: nextProps.value });
    }

    render() {
        let id = this.props.id || false;
        let name = this.props.name || false;
        let placeholder = this.props.placeholder || false;

        let selectOptions;
        if (this.props.options) {
            selectOptions = this.props.options.map((option) => {
                let selected = false;
                if (this.props.selected && this.props.selected.toLowerCase() == option.toLowerCase())
                    selected = true;
                return <option value={option} selected={selected}>{option}</option>
            });
        }

        return (
            <select id={id} className={this.getClass()} name={name} value={this.state.value} placeholder={placeholder} disabled={this.isDisabled()} readonly={this.isReadOnly()} required={this.isRequired()} onChange={this.handleChange.bind(this)} >
                {selectOptions}
            </select>
        )
    }
}