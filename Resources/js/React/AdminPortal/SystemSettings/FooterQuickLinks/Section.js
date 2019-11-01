import React, { Component, Fragment } from 'react';
import { FormGroup, Input } from '../../../Components/FormControl';
import { ConfirmButton, BtnGroup } from '../../../Components/Button';
import SelectPage from './AddPageLink';
import PageRow from './PageLink';
import _ from 'lodash';
import $ from 'jquery';

export class Section extends Component {
    constructor(props) {
        super(props);

        this.state = {
            value: _.cloneDeep(this.props.section.title)
        }

        console.log(this.props.sectionId)
    }

    cancelChange() {
        this.setState({
            value: _.cloneDeep(this.props.section.title)
        });
    }

    saveChange(sectionId) {
        $.ajax({
            type: 'put',
            url: `${this.props.baseUri}/quicklink/${sectionId}`,
            data: {
                title: this.state.value
            }
        }).done(() => {
            this.props.u();
        }).fail((err) => {
            console.error(`[Section@saveChange] Error updating page title: `, err.responseText);
        });
    }

    updateVal(e) {
        this.setState({
            value: e
        });
    }


    render() {
        let currentPages;
        if (this.props.section.pages) {
            currentPages = this.props.section.pages.map((page) => {
                return <PageRow page={page} baseUri={this.props.baseUri} u={this.props.u} />
            });
        }

        let actions;
        if (this.state.value != this.props.section.title) {
            actions = (
                <BtnGroup size="sm" className='float-right pb-2'>
                    <ConfirmButton className="btn btn-danger" cb={this.cancelChange.bind(this)}>
                        Cancel <i className="fas fa-times"></i>
                    </ConfirmButton>

                    <ConfirmButton className="btn btn-success" cb={this.saveChange.bind(this, this.props.sectionId)}>
                        Save <i className="fas fa-check"></i>
                    </ConfirmButton>
                </BtnGroup >
            )            
        }

        return (
            <Fragment>
                <FormGroup label="Section Title" required>    
                    {actions}
                    
                    <Input type="text" value={this.state.value} cb={this.updateVal.bind(this)} required />
                </FormGroup>


                <div>
                    <table class="table table-hover table-sm">
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>
                                    <SelectPage pages={this.props.avaliablePages}
                                        sectionId={this.props.sectionId}
                                        baseUri={this.props.baseUri}
                                        u={this.props.u}
                                    />
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentPages}
                        </tbody>
                    </table>
                </div>
            </Fragment>
        )
    }
}