import React, { Component } from 'react';
import ReactTooltip from 'react-tooltip'

const AutoComplete = ["name", "email", "organization", "on"];
const Type = ["email", "file", "image", "password", "url"];

export class Checkbox extends Component {
    constructor(props) {
        super(props);

        this.state = {
            checked: this.props.checked || false
        }
    }

    toggleCheckbox() {
        this.setState({
            checked: !this.state.checked
        }, () => {
            if (this.props.cb)
                this.props.cb(this.state.checked);
        });
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.checked && nextProps.checked != this.state.checked) {
            this.setState({
                checked: nextProps.checked
            });
        }
    }

    render() {
        let id = this.props.id ? `chq-${this.props.id}` : null;

        return (
            <div className="custom-control custom-checkbox">
                <ReactTooltip />
                <input id={id}
                    type="checkbox"
                    class="custom-control-input"
                    name={this.props.name || null}
                    checked={this.state.checked}
                    onChange={this.toggleCheckbox.bind(this)}
                />

                <label className='custom-control-label noselect'
                    htmlFor={id}
                    data-tip={this.props.tooltip || null}
                >
                    {this.props.label}
                </label>
            </div>
        )
    }
}

export class FormGroup extends Component {
    render() {
        let label;
        if (this.props.label) {
            label = (
                    <label className={this.props.required ? "required" : false} htmlFor={ this.props.htmlFor || null} >
                        {this.props.label}
                    </label>
                );
        }

        return (
            <div className="form-group">
                {label}
                {this.props.children}
            </div>
        )
    }
}

export class Input extends Component {
    constructor(props) {
        super(props);

        this.state = {
            value: this.props.value
        }
    }

    handleChange(e) {
        this.setState({
            value: e.target.value
        });

        // Send the value to the (optional) callback
        if (this.props.cb)
            this.props.cb(e.target.value);
    }

    getAutoComplete() {
        if (AutoComplete.includes(this.props.autoComplete))
            return this.props.autoComplete;
        
        switch (this.props.autoComplete) {
            case "phone":
                return "tel";
            case "password":
                return "current-password";
            case "newpassword":
                return "new-password";
            default:
                return "off";
        }
    }

    getType() {
        if (!this.props.type)
            throw 'You must provide a type for the input field';

        if (Type.includes(this.props.type))
            return this.props.type;

        switch (this.props.type) {
            case "date":
                return "datetime-local";
            default:
                return "text";
        }
    }

    componentWillReceiveProps(nextProps) {
        if (this.state.value != nextProps.value)
            this.setState({
                value: nextProps.value
            });
    }
  
    
    render() {
        return (
            <input id={ this.props.id || false }
                type={this.getType()}
                className={ this.props.inputClass || "form-control" }
                name={ this.props.name || false }
                value={ this.state.value }
                placeholder={ this.props.placeHolder || false }
                autocomplete={ this.getAutoComplete() }
                disabled={ !!this.props.disabled }
                readonly={ !!this.props.readOnly }
                required={ !!this.props.required }
                autoFocus={ !!this.props.autoFocus }
                minLength={ this.props.minLength || false }
                maxLength={ this.props.maxLength || false }
                onChange={this.handleChange.bind(this)}
            />
        )
    }
}

export class Select extends Component {
    constructor(props) {
        super(props);
        this.state = {
            value: this.props.value
        }
    }

    handleChange(e) {
        this.setState({
            value: e.target.value
        });

        // Send the value to the (optional) callback
        if (this.props.cb)
            this.props.cb(e.target.value);
    }

    componentWillReceiveProps(nextProps) {
        if (this.state.value != nextProps.value)
            this.setState({
                value: nextProps.value
            });
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
            <select id={ this.props.id || false }
                className={ this.props.inputClass || "form-control" }
                name={ this.props.name || false }
                disabled={ !!this.props.disabled }
                readonly={ !!this.props.readOnly }
                required={ !!this.props.required }
                onChange={ this.handleChange.bind(this) }
            >
                {selectOptions}
            </select>
        )
    }
}

export class TextArea extends Component {
    constructor(props) {
        super(props);

        this.state = {
            value: this.props.value
        }
    }

    handleChange(e) {
        this.setState({
            value: e.target.value
        });

        // Send the value to the (optional) callback
        if (this.props.cb)
            this.props.cb(e.target.value);
    }

    getAutoComplete() {
        if (AutoComplete.includes(this.props.autoComplete))
            return this.props.autoComplete;

        switch (this.props.autoComplete) {
            case "phone":
                return "tel";
            case "password":
                return "current-password";
            case "newpassword":
                return "new-password";
            default:
                return "off";
        }
    }

    componentWillReceiveProps(nextProps) {
        if (this.state.value != nextProps.value)
            this.setState({
                value: nextProps.value
            });
    }

    getCharCount() {
        return this.state.value && this.state.value.length ? this.state.value.length : 0
    }

    render() {
        let charLimit;
        if (this.props.maxLength) {
            charLimit = (
                <span className="d-block text-right">{this.props.maxLength - this.getCharCount()} characters remaining</span>
            )
        }

        return (
            <React.Fragment>
                <textarea id={this.props.id || false}
                    className={this.props.inputClass || "form-control"}
                    name={this.props.name || false}
                    value={this.state.value}
                    placeholder={this.props.placeHolder || false}
                    autocomplete={this.getAutoComplete()}
                    rows={this.props.rows || false }
                    disabled={!!this.props.disabled}
                    readonly={!!this.props.readOnly}
                    required={!!this.props.required}
                    autoFocus={!!this.props.autoFocus}
                    minLength={this.props.minLength || false}
                    maxLength={this.props.maxLength || false}
                    onChange={this.handleChange.bind(this)}
                />
                {charLimit}
            </React.Fragment>
        )
    }
}