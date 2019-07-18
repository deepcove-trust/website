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

    componentWillReceiveProps(nextProps) {
        if (this.state.value != nextProps.value)
            this.setState({ value: nextProps.value });
    }
  
    
    render() {
        return (
            <input id={ this.props.id || false }
                type={this.getType()}
                className={ this.props.inputClass || "form-control" }
                name={ this.props.name || false }
                value={this.state.value}
                placeholder={ this.props.placeHolder || false }
                autocomplete={this.getAutoComplete()}
                disabled={ this.props.disabled ? true : false }
                readonly={ this.props.readOnly ? true : false }
                required={ this.props.required ? true : false }
                onChange={this.handleChange.bind(this)}
            />
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

    componentWillReceiveProps(nextProps) {
        if (this.state.value != nextProps.value)
            this.setState({ value: nextProps.value });
    }

    render() {
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
            <select id={this.props.id || false}
                className={this.props.inputClass || "form-control"}
                name={this.props.name || false}
                value={this.state.value}// Is this needed?? The value is actually set using a "selected" attribute in the correct option
                placeholder={this.props.placeHolder || false}
                disabled={this.props.disabled ? true : false}
                readonly={this.props.readOnly ? true : false}
                required={this.props.required ? true : false}
                onChange={this.handleChange.bind(this)}
            >
                {selectOptions}
            </select>
        )
    }
}