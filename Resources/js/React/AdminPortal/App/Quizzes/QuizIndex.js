import React, { Component, Fragment } from 'react';
import $ from 'jquery';

import Card, { CardHighlight } from '../../../Components/Card';

const url = '/api/admin/app/quizzes';

export default class QuizIndex extends Component {    

    constructor(props) {
        super(props);

        this.state = {
            quizzes: null
        }
    }

    componentDidMount() {
        this.getData();
    }

    getData() {
        $.ajax({
            type: 'get',
            url: url,
        }).done((data) => {
            this.setState({
                quizzes: data
            });
        }).fail((err) => {
            this.props.alert(null, err.responseText);
        });
    }

    render() {

        let quizCards = [];
        if (this.state.quizzes) quizCards = this.state.quizzes.map(q => {
            return <QuizCard key={q.id} quiz={q} cb={this.props.onSelect.bind(this, q.id)} />
        })

        quizCards.push(<NewQuizCard key="0" cb={this.props.onAdd.bind(this)} />)

        return (
            <Card className="card px-0 col-xl-5 col-lg-6 col-md-8 mx-auto my-5">
                <CardHighlight>
                    <h3 className="pt-3 pb-2">Select Quiz</h3>
                </CardHighlight>
                <div>
                    {quizCards}
                </div>
            </Card>
            )
    }
}

class QuizCard extends Component {
    render() {
        let active = this.props.quiz.active;

        return (
            <div className="m-2 row quiz-card p-3 pointer" onClick={this.props.cb.bind(this, this.props.quiz.title)}>
                <div></div>
                <div className="col-7">
                    <h5>{this.props.quiz.title}</h5>
                    <span className="question-count">{this.props.quiz.questionCount} questions</span>
                </div>
                <div className="col-5 text-right">
                    <small className={`font-weight-bold ${active ? "text-success" : "text-muted"}`}>{active ? "ENABLED" : "DISABLED"}</small> 
                </div>
            </div>
            )
    }
}

class NewQuizCard extends Component {
    render() {
        return (
            <div className="text-center m-3 quiz-card pointer" onClick={this.props.cb.bind(this)} style={{ color: "#AEAEAE" }}>
                <div className="inline-block ff-category-card py-2" style={{ height: "80px" }}>
                    <i className="far fa-plus-circle fa-3x"></i>
                    <small className="d-block">Add new</small>
                </div>
            </div>
            )
    }
}