import React, { Component, Fragment } from 'react';

export default class InfiniteScroll extends Component {
    constructor(props) {
        super(props);

        this.state = {
            data: this.props.items || [],
            index: 1,
            per: this.props.per || 3
        }
    }

    render() {
        let items = [];

        for (let c = 0; c < this.state.index; ) {
            let x;
            for (x = c; x < c + this.state.per; x++) {
                let media = this.state.data[x];
                if (!media) break;
                let key = media.id;

                items.push(
                    <div className="col-lg-4 col-6" key={key}>
                        <Item file={media} selected={media.id == this.state.selectedId} cb={(selectedId) => this.setState({ selectedId })} />
                    </div>
                );
            }

            c = x;
        }

        return (
            <div className="row">
                {items}
                <button onClick={(x) => this.setState({index: this.state.index + 1})}>Infinite Scroll</button>
            </div>
        );
    }
}

class Item extends Component {
    render() {
        return (
            <div className={this.props.selected ? "selected" : null}>
                <img src={`/media?filename=${this.props.file.filename}`}
                    style={{ 'width': '100%', 'objectFit': 'cover' }}
                    height={'200px'}
                    alt={this.props.file.name}
                    onClick={this.props.cb.bind(this, this.props.file.id)}
                />

                <p className="text-center py-2">{this.props.file.name}</p>
            </div>
        )
    }
}