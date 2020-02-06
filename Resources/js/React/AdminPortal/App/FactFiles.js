import React, { Component, Fragment } from 'react';
import { render } from 'react-dom';
import Alert from '../../Components/Alert';
import CategoryIndex from './FactFiles/CategoryIndex';
import CategoryDetails from './FactFiles/CategoryDetails';
import ErrorBoundary from '../../Errors/ErrorBoundary';

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

    // This is required for the component to pass down its this.Alert object
    // correctly (this.Alert is undefined until the component has mounted).
    componentDidMount() {
        this.setState({})
    }

    // User selects a category from the category list
    onCategorySelect(selectedCategoryId) {
        this.setState({
            selectedCategoryId
        });
    }

    // User clicks 'back' to return to index view
    clearSelection() {
        this.setState({
            selectedCategoryId: null
        })
    }

    render() {
        let content;

        if (this.state.selectedCategoryId) {
            content = <CategoryDetails categoryId={this.state.selectedCategoryId} clearSelection={this.clearSelection.bind(this)} alert={this.Alert} />
        } else {
            content = <CategoryIndex onSelection={this.onCategorySelect.bind(this)} alert={this.Alert} />
        }

        return (
            <ErrorBoundary customError="react-fact-files">
                <Alert onRef={ref => this.Alert = ref}>
                    <div>
                        <h1 className="text-center my-5">Fact File Management</h1>
                        {content}
                    </div>
                </Alert>
            </ErrorBoundary>
        );
    }
}

if (document.getElementById('react_app_factfiles')) {
    render(<FactFiles />, document.getElementById('react_app_factfiles'));
}