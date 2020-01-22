import React, { Component, Fragment } from 'react';
import { render } from 'react-dom';
import Alert from '../../Components/Alert';
import CategoryIndex from './FactFiles/CategoryIndex';
import CategoryDetails from './FactFiles/CategoryDetails';

/**
 * Root component for the fact file management UI
 * */
export default class FactFiles extends Component {

    constructor(props) {
        super(props);

        this.state = {
            selectedCategory: null
        };
    }

    // User selects a category from the category list
    onCategorySelect(categoryId) {
        this.setState({
            selectedCategory: categoryId
        });
    }

    // User saves or updates new category. ID is 0 for new category
    onCategorySave(category) {

        // Make http request to save / update

    }

    render() {
        let content;

        if (this.state.selectedCategory) {
            content = <CategoryDetails categoryId={this.state.selectedCategory} />
        } else {
            content = <CategoryIndex onSelection={this.onCategorySelect.bind(this)} onSave={this.onCategorySave.bind(this)} />
        }

        return (
            <div>
                <h1 className="text-center my-5">Fact File Management</h1>
                {content}
            </div>
        );
    }
}

if (document.getElementById('react_app_factfiles')) {
    render(<FactFiles />, document.getElementById('react_app_factfiles'));
}