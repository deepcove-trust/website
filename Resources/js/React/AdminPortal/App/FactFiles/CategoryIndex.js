import React, { Fragment, Component } from 'react';
import Alert from '../../../Components/Alert';
import { Input } from '../../../Components/FormControl';
import { Button } from '../../../Components/Button';
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
            addingCategory: false,
            actionPending: false
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
            console.log(err);
        });
    }

    onAddCategory() {        
        this.setState({
            addingCategory: true
        });
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
            this.Alert.success("New category added!");
            this.setState({
                addingCategory: false,
                actionPending: false
            });
            this.getData();
        }).fail((err) => {
            this.Alert.error(null, err.responseText);
            this.setState({
                actionPending: false
            })
        });
        
    }

    render() {

        let categories = this.state.categories || [];

        let categoryCards = categories.map(cat => {
            return <CategoryCard key={cat.id} categoryId={cat.id} categoryName={cat.name} entryCount={cat.entryCount} cb={this.props.onSelection.bind(this)} />
        });

        // Append the button to add a new category
        categoryCards.push(<NewCategoryCard key="0" addingCategory={this.state.addingCategory} pending={this.state.actionPending} cb={this.onAddCategory.bind(this)} onSave={this.onSaveCategory.bind(this)}/>)

        return (
            <Alert onRef={ref => (this.Alert = ref)}>
                <div className="left-border min-width-300 card px-0 col-4 mx-auto my-5">
                    <h3 className="text-center pt-3 pb-2 bground-primary text-white">Select Category</h3>
                    <div>
                        {categoryCards}
                    </div>
                </div>
            </Alert>
        )
    }
}

class CategoryCard extends Component {
    render() {
        return (
            <div className="m-2 row category-card" onClick={this.props.cb.bind(this, this.props.categoryId)}>
                <div className="col-7">
                    <h5>{this.props.categoryName}</h5>
                </div>
                <div className="col-5">
                    <p className="d-inline">{this.props.entryCount} entries</p>
                </div>
            </div>
        )
    }
}

// Will either display as an 'add' button if not yet clicked, or as a new category 'form' if clicked.
class NewCategoryCard extends Component {
    constructor(props) {
        super(props);

        this.state = {
            categoryName: null
        }
    }

    updateField(categoryName) {
        this.setState({
            categoryName
        });
    }

    render() {

        if (this.props.addingCategory) {
            return (
                <form className="m-2 py-4 form-inline" onSubmit={(e) => { this.props.onSave(e, this.state.categoryName) }}>                    
                    <div>
                        <Input type="text" value={this.state.categoryName} placeHolder="Enter category name" cb={this.updateField.bind(this)} required />
                    </div>
                    <div className="ml-auto">
                        <Button type="submit" pending={this.props.pending} className="btn btn-success">Save</Button>
                    </div>
                </form>
                )
        }

        return (
            <div className="text-center m-3" onClick={this.props.cb.bind(this)}>
                <div className="inline-block category-card py-2" style={{ height: "80px"}}>
                    <i className="fas fa-plus-circle fa-3x"></i>
                    <small className="d-block">Add new</small>
                </div>
            </div>
            )
    }
}