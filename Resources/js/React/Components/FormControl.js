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
                    className="custom-control-input"
                    name={this.props.name || null}
                    checked={this.state.checked}
                    onChange={this.toggleCheckbox.bind(this)}
                />

                <label className='custom-control-label noselect'
                    htmlFor={id}
                    data-tip={this.props.tooltip || null}
                >
                    {this.props.label || this.props.children}
                </label>
            </div>
        )
    }
}

export class CKEditor extends Component {
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

export class FormGroup extends Component {
    render() {
        let label;
        if (this.props.label) {
            label = (
                <label className={this.props.required ? "required" : ''} htmlFor={this.props.htmlFor || null} >
                    {this.props.label}
                </label>
            );
        }

        return (
            <div className={`form-group ${this.props.className || ''}`}>
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
            value: this.props.value || ""
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
            <input id={this.props.id || null}
                type={this.getType()}
                className={this.props.inputClass || "form-control"}
                name={this.props.name || null}
                value={this.state.value || ""}
                placeholder={this.props.placeHolder || null}
                autoComplete={this.getAutoComplete()}
                disabled={!!this.props.disabled}
                readOnly={!!this.props.readOnly}
                required={!!this.props.required}
                autoFocus={!!this.props.autoFocus}
                minLength={this.props.minLength || null}
                maxLength={this.props.maxLength || null}
                onChange={this.handleChange.bind(this)}
                onPaste={this.handleChange.bind(this)}
                ref={this.props.inputRef}
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
            selectOptions = this.props.options.map((option, key) => {

                return <option value={option} key={key}>{option}</option>
            });
        }

        return (
            <select id={this.props.id || null}
                className={this.props.inputClass || "form-control"}
                name={this.props.name || null}
                disabled={!!this.props.disabled}
                readOnly={!!this.props.readOnly}
                required={!!this.props.required}
                value={this.props.selected || ""}
                onChange={this.handleChange.bind(this)}
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
                <textarea id={this.props.id || null}
                    className={this.props.inputClass || "form-control"}
                    name={this.props.name || null}
                    value={this.state.value || ""}
                    placeholder={this.props.placeHolder || null}
                    autoComplete={this.getAutoComplete()}
                    rows={this.props.rows || undefined}
                    disabled={!!this.props.disabled}
                    readOnly={!!this.props.readOnly}
                    required={!!this.props.required}
                    autoFocus={!!this.props.autoFocus}
                    minLength={this.props.minLength || null}
                    maxLength={this.props.maxLength || null}
                    onChange={this.handleChange.bind(this)}
                />
                {charLimit}
            </React.Fragment>
        )
    }
}