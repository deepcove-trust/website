import React, { Component, Fragment } from 'react';

import { FormGroup, Input, TextArea } from '../../../../Components/FormControl';
import { Button } from '../../../../Components/Button';

export default class EntryNuggets extends Component {

    constructor(props) {
        super(props);

        this.state = {
            addPending: false,
            newNugget: {
                imageId: null,
                name: null,
                text: null,
                image: {
                    filename: null
                }
            }
        };
    }

    onCancel() {
        this.setState({
            addPending: false,
            newNugget: {
                imageId: null,
                name: null,
                text: null,
                image: {
                    filename: null
                }
            }
        });
    }

    updateNewNugget(key, val) {
        let newNugget = this.state.newNugget;
        newNugget[key] = val;
        this.setState({
            newNugget
        });
    }

    addNewNugget() {
        this.props.onAdd(this.state.newNugget);
        this.onCancel();
    }

    render() {

        let nuggets = this.props.nuggets.map((nugget, index) =>
            <NuggetCard key={nugget.id}
                nugget={nugget}
                onUpdate={this.props.onUpdate.bind(this, index)}
                onDelete={this.props.onDelete.bind(this, index)}
                onShift={this.props.onShift.bind(this, index)}
            />);

        // Add 'new' button
        nuggets.push(<NewNuggetCard key="0"
            addPending={this.state.addPending}
            onUpdate={this.updateNewNugget.bind(this)}
            onAddPending={() => this.setState({ addPending: true })}
            pendingNugget={this.state.newNugget}
            onCancel={this.onCancel.bind(this)}
            onAdd={this.addNewNugget.bind(this)} />)

        return (
            <div className="card mt-3">
                <div className="bground-primary pt-3 text-white text-center"><h5>Highlights</h5></div>
                <div className="p-3">
                    {nuggets}
                </div>
            </div>
        )
    }
}

class NuggetCard extends Component {
    render() {

        let nuggetImage = this.props.nugget.image.filename
            ? <img className="img-fluid bg-dark p-2" alt="No Image" src={`/media?filename=${this.props.nugget.image.filename}`} />
            : <h5>No Image</h5>;

        let nuggetControls;
        if (!this.props.addNuggetCard) {
            nuggetControls = <NuggetControls onDelete={this.props.onDelete.bind(this)} onShift={this.props.onShift.bind(this)} />
        }

        return (
            <div className="card p-2 mt-2">
                <div className="row">                    
                    <div className="col-4">
                        <div className="nugget-image">
                            {nuggetImage}
                            <p>Edit</p>
                        </div>
                    </div>
                    <div className="nugget-text col-8">
                        <FormGroup htmlFor={`nugget-name-${this.props.nugget.id}`} label="Name">
                            <Input id={`nugget-name-${this.props.nugget.id}`} type="text" value={this.props.nugget.name} cb={this.props.onUpdate.bind(this, "name")} />
                        </FormGroup>
                        <FormGroup htmlFor={`nugget-text-${this.props.nugget.id}`} label="Content">
                            <TextArea id={`nugget-text-${this.props.nugget.id}`} value={this.props.nugget.text} cb={this.props.onUpdate.bind(this, "text")} />
                        </FormGroup>
                    </div>
                    {nuggetControls}
                </div>
            </div>
            )
    }
}

class NewNuggetCard extends Component {
    render() {

        let addButton = (
            <div>
                <div className="w-100 mt-2 new-image-card card text-center" onClick={this.props.onAddPending}>
                    <i className="far fa-plus-square fa-5x"></i>
                </div>
            </div>
        )

        let newNuggetForm = (
            <Fragment>
                <NuggetCard nugget={this.props.pendingNugget} onUpdate={this.props.onUpdate.bind(this)} addNuggetCard="true" />
                <div className="w-100 text-right">
                    <Button className="btn btn-danger" cb={this.props.onCancel.bind(this)}><i className="fas fa-times"></i></Button>
                    <Button className="btn btn-success" cb={this.props.onAdd.bind(this)}><i className="fas fa-check"></i></Button>
                </div>
            </Fragment>
        )

        return this.props.addPending ? newNuggetForm : addButton;
    }
}

class NuggetControls extends Component {
    render() {
        return (
            <div className="nugget-controls">
                <Button className="btn btn-gray" cb={this.props.onShift.bind(this, 'down')}><i className="fas fa-chevron-up"></i></Button>
                <Button className="btn btn-gray" cb={this.props.onShift.bind(this, 'up')}><i className="fas fa-chevron-down"></i></Button>
                <Button className="btn btn-gray" cb={this.props.onDelete.bind(this)}><i className="fas fa-times"></i></Button>
            </div>
            )
    }
}