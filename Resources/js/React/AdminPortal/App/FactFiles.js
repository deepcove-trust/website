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
            selectedCategoryId: null
        };
    }

    // User selects a category from the category list
    onCategorySelect(selectedCategoryId) {
        this.setState({
            selectedCategoryId
        });
    }

    // User saves or updates new category. ID is 0 for new category
    onCategorySave(category) {

        // Make http request to save / update

    }

    // User clicks 'back' to return to index view
    onBack() {
        this.setState({
            selectedCategoryId: null
        })
    }

    render() {
        let content;

        if (this.state.selectedCategoryId) {
            content = <CategoryDetails categoryId={this.state.selectedCategoryId} onBack={this.onBack.bind(this)} />
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