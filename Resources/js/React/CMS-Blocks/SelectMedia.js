import React, { Component } from 'react';
import Modal from '../Components/Modal';

export default class SelectMedia extends Component {
    render() {
        if (!this.props.showModal) return <div />

        return (
            <Modal size="lg" title={`Select an ${this.props.type}`}
                handleHideModal={this.props.handleHideModal}
            >
                CONTENT HERE
            </Modal>
        );
    }
}