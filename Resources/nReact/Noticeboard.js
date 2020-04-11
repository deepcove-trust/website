import React, { Component, Fragment } from 'react';
import { render } from 'react-dom';
import { StaticAlert } from '../js/React/Components/Alert';
import Modal from '../js/React/Components/Modal';
import { formatDate } from '../js/helpers';
import _ from 'lodash';


const baseUri = '/api/notices';

export default class Noticeboard extends Component {
    constructor(props) {
        super(props);

        this.state = {
            notices: [],
            showNotice: null,
            index: 0,
        };
    }
  
    componentDidMount() {
        $.ajax({
            method: 'get',
            url: baseUri
        }).done((notices) => {
            this.setState({ notices });
        }, () => {
            this.timer = setInterval(() =>
                this._tick(), 15 * 1000
            );
        });
    }

    componentwillunmount() {
        this.timer = null;
    }

    _tick() {
        const { index, notices } = this.state;
        this.setState({
            index: (index < (notices.length -1)) ? index + 1 : 0
        });
    }

    _handleModal(showNotice) {
        this.setState({
            showNotice
        });
    }


    render() {
        let notice = this.state.notices[this.state.index];
        let modalNotice = this.state.showNotice;
        // Dont render if no notices are posted
        if (!notice) return null;
        
        let modal = modalNotice ? (
            <NoticeModal notice={modalNotice} handleHideModal={this._handleModal.bind(this, null)} />
        ) : null;


        return (
            <Fragment>
                <StaticAlert className='noticeboard'>
                    <i className={`fas fa-exclamation-triangle text-warning pr-3`} />
                    {notice.title} - <span className="learnMore" onClick={this._handleModal.bind(this, notice)}>Learn More</span>
                </StaticAlert>

                {modal}
            </Fragment>
        );
    }
}

class NoticeModal extends Component {
    render() {
        const { longDesc, title, updatedAt } = this.props.notice;

        const _title = (
            <span>
                <i className={`fas fa-exclamation-triangle pr-3`} />
                {title}
            </span>    
        );

        return (
            <Modal title={_title} handleHideModal={this.props.handleHideModal}>
                <p dangerouslySetInnerHTML={{ __html: longDesc.replace('\n', '<br/><br/>') }} />
                <p className='text-right'>Updated at {formatDate(updatedAt)}</p>
            </Modal>
        )
    }
}

if (document.getElementById('react_noticeboard')) {
    render(<Noticeboard />, document.getElementById('react_noticeboard'));
}