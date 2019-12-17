import React, { Component } from 'react';
import { PageUrl } from '../../../../helpers';
import { Button } from '../../../Components/Button';

export default class Page extends Component {
    render() {
        return (
            <tr>
                <Link page={this.props.page} />
                <Delete page={this.props.page} removeLinkCb={this.props.removeLinkCb} />
            </tr>
        )
    }
}

class Link extends Component {
    render() {
        return (
            <td>
                <a href={PageUrl(this.props.page.name, this.props.page.section)}>
                    {this.props.page.name || "Home"}
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

    render() {
        return (
            <td>
                <Button className="btn btn-danger btn-sm float-right"
                    pending={this.state.pending}
                    type="button"
                    cb={this.props.removeLinkCb.bind(this, this.props.page.id)}>
                        Remove Quick Link <i className="fas fa-times"></i>
                </Button>
            </td>
        )
    }
}