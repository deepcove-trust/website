import React, { Component } from 'react';
import { PageUrl } from '../../../../helpers';
import { Button } from '../../../Components/Button';
import $ from 'jquery';

export default class Page extends Component {
    render() {
        return (
            <tr>
                <Link page={this.props.page} />
                <Delete page={this.props.page}
                    baseUri={this.props.baseUri}
                    u={this.props.u}
                />
            </tr>
        )
    }
}

class Link extends Component {
    render() {
        return (
            <td>
                <a href={PageUrl(this.props.page.name, this.props.page.section)}>
                    {this.props.page.name}
                </a>
            </td>
        )
    }
}

class Delete extends Component {
    constructor(props) {
        super(props);

        this.state = { pending: false }
    }

    handleDelete(id) {
        this.setState({
            pending: true
        }, () => {
            $.ajax({
                method: 'delete',
                url: `${this.props.baseUri}/${id}`
            }).done(() => {
                this.setState({
                    pending: false
                }, () => this.props.u());
            }).fail((err) => {
                console.error(err);
            })
        })
    }

    render() {
        return (
            <td>
                <Button className="btn btn-danger btn-sm float-right"
                    pending={this.state.pending}
                    type="button"
                    cb={this.handleDelete.bind(this, this.props.page.id)}
                >
                    Remove Quick Link <i className="fas fa-times"></i>
                </Button>
            </td>
        )
    }
}