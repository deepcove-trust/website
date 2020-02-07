import React, { Fragment, Component } from 'react';
import { Input } from '../../../Components/FormControl';
import { Button } from '../../../Components/Button';
import Card, { CardHighlight } from '../../../Components/Card';
import $ from 'jquery';


const url = '/admin/app/factfiles/categories'

/**
 * Displays the list of categories in the database
 * */
export default class CategoryIndex extends Component {

    constructor(props) {
        super(props);

        this.state = {
            categories: null,
        }
    }

    componentDidMount() {
        this.getData();
    }

    /** Retrive list of categories from the server */
    getData() {
        $.ajax({
            type: 'get',
            url: url,
        }).done((data) => {
            this.setState({
                categories: data
            });
        }).fail((err) => {
            this.props.alert.err(null, err.responseText);
        });
    }    

    render() {

        let categories = this.state.categories || [];

        let categoryCards = categories.map(cat => {
            return <CategoryCard key={cat.id} categoryId={cat.id} categoryName={cat.name} entryCount={cat.entryCount} activeCount={cat.activeCount} cb={this.props.onSelection.bind(this)} />
        });

        // Append the button to add a new category
        categoryCards.push(<NewCategoryCard key="0" onSave={this.getData.bind(this)} alert={this.props.alert} />)

        return (
            <Card className="card px-0 col-lg-4 col-md-6 mx-auto my-5">
                <CardHighlight>
                    <h3 className="pt-3 pb-2 ">Select Category</h3>
                </CardHighlight>
                <div>
                    {categoryCards}
                </div>
            </Card>
        )
    }
}

class CategoryCard extends Component {
    render() {
        return (
            <div className="m-2 row list-card" onClick={this.props.cb.bind(this, this.props.categoryId)}>
                <div className="col-7">
                    <h5 className="vertically-center">{this.props.categoryName}</h5>
                </div>
                <div className="col-5">
                    <div className="vertically-center">
                        <span className="d-block">{this.props.entryCount} entries</span>
                        <small>{`(${this.props.activeCount} active)`}</small>
                    </div>
                </div>
            </div>
        )
    }
}

class NewCategoryCard extends Component {
    constructor(props) {
        super(props);

        this.state = {
            categoryName: null,
            actionPending: false,
            addingCategory: false
        }
    }

    onSaveCategory(ev, categoryName) {
        ev.preventDefault();

        this.setState({
            actionPending: true
        });

        $.ajax({
            method: 'post',
            url: url,
            data: {
                categoryName
            }
        }).done(() => {
            this.props.alert.success("New category added!");
            this.setState({
                actionPending: false,
                categoryName: null
            });
            this.props.onSave();
        }).fail((err) => {
            this.props.alert.error(null, err.responseText);
            this.setState({
                actionPending: false
            })
        });
    }

    onAddCategory() {
        this.setState({
            addingCategory: true
        });
    }

    onCancel() {
        this.setState({
            addingCategory: false,
            categoryName: null
        });
    }

    updateField(categoryName) {
        this.setState({
            categoryName
        });
    }

    render() {

        if (this.state.addingCategory) {
            return (
                <form className="m-2 py-4 form-inline add-list-card" onSubmit={(e) => { this.onSaveCategory(e, this.state.categoryName) }}>                    
                    <div className="mx-auto">                        
                        <Input type="text" value={this.state.categoryName} placeHolder="Enter category name" cb={this.updateField.bind(this)} required />
                        <Button type="button" pending={this.state.actionPending} cb={this.onCancel.bind(this)} className="btn btn-danger"><i className="fas fa-times"></i></Button>
                        <Button type="submit" pending={this.state.actionPending} className="btn btn-success"><i className="fas fa-check"></i></Button>
                    </div>
                </form>
                )
        }

        return (
            <div className="text-center m-3" onClick={this.onAddCategory.bind(this)} style={{ color: "#AEAEAE" }}>
                <div className="inline-block list-card py-2" style={{ height: "80px"}}>
                    <i className="far fa-plus-circle fa-3x"></i>
                    <small className="d-block">Add new</small>
                </div>
            </div>
            )
    }
}