import React, { Component, Fragment } from 'React';
import { FormGroup, Input } from '../../../Components/FormControl';
import { BtnGroup, ConfirmButton, Button } from '../../../Components/Button';
import $ from 'jquery';

export default class Title extends Component {
    constructor(props) {
        super(props);

        this.state = {
            value: "",
            pending: false
        }
    }

    componentWillUpdate(nextProps) {

        if (nextProps.section != this.props.section) {
            this.setState({
                value: nextProps.section.title || ""
            });
        }
    }

    reset() {
        this.setState({
            value: this.props.section.title
        });
    }

    saveChange() {
        $.ajax({
            type: 'put',
            url: `${this.props.baseUri}/${this.props.sectionId}`,
            data: {
                title: this.state.value
            }
        }).done(() => {
            this.props.alert.success("Section title updated!")
            this.props.u()
        }).fail((err) => {
            this.props.alert.erorr(null, err.responseText)
        });
    }

    render() {
        if (!this.props.section) return null;

        let actions = this.state.value != this.props.section.title ? (
            <BtnGroup size="sm" className="float-right pb-2">
                <ConfirmButton className="btn btn-danger" cb={this.reset.bind(this)}>
                    Cancel <i className="fas-fa-times" />
                </ConfirmButton>

                <Button className="btn btn-success" pending={this.state.pending} cb={this.saveChange.bind(this)}>
                    Save <i className="fas fa-check" />
                </Button>
            </BtnGroup>
        ) : null;

        return (
            <Fragment>
                {actions}
                <FormGroup label="Section Title" required>
                    <Input type="text" value={this.state.value}
                        cb={(value) => this.setState({
                            value
                        })}
                    />
                </FormGroup>
            </Fragment>
        );
    }
}