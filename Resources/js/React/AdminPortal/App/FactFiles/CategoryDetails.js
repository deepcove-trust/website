import React, { Component, Fragment } from 'react';

const url = '/admin/app/factfiles/categories';

export default class CategoryDetails extends Component {
    constructor(props) {
        super(props);

        this.state = {
            category: null
        }
    }

    componentDidMount() {
        this.getData();
    }

    getData() {
        $.ajax({
            type: 'get',
            url: `${url}/${this.props.categoryId}`,
        }).done((data) => {
            this.setState({
                category: data
            });
        }).fail((err) => {
            console.log(err);
        });
    }    

    render() {
        return <h1>Category Details</h1>
    }
}