import React, { Component } from 'react';

export default class InfiniteScroll extends Component {
    constructor(props) {
        super(props);

        let per = this.props.per || 3
        this.state = {
            data: this.props.children || [],
            index: 3 * per,
            per
        }
    }

    componentDidUpdate() {
        if (this.props.children != this.state.data) {
            this.setState({
                data: this.props.children,
                index: 3 * this.state.per
            });
        }
    }

    handleScroll() {
        var element = document.getElementsByClassName('infinite_scroll')[0];
        if (element.scrollHeight - element.scrollTop === element.clientHeight) {
            this.setState({
                index: this.state.index + this.state.per
            });
        }
    }

    render() {
        let items = [];

        for (let c = 0; c < this.state.index; c++) {
            let media = this.state.data[c];
            if (media) {
                items.push(media);
            }
        }

        return (
            <div className="row mt-3 infinite_scroll" onScroll={this.handleScroll.bind(this)}>
                {items}
            </div>
        );
    }
}

