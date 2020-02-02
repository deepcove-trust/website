import React, { Component, Fragment } from 'react';
import $ from 'jquery';

import DevicePreview from '../../../Components/DevicePreview';
import Card, { CardHighlight } from '../../../Components/Card';
import QuizSettings from './QuizDetails/QuizSettings';
import QuizQuestions from './QuizDetails/QuizQuestions';

const url = '/api/admin/app/quizzes';

export default class QuizDetails extends Component {

    constructor(props) {
        super(props);

        this.state = {
            showEditButtons: true,
            quiz: {
                id: this.props.quizId,
                active: null,
                title: null,
                image: {
                    id: null,
                    filename: null
                },
                questions: [],
            }
        }
    }

    updateField(key, val) {
        let quiz = this.state.quiz;
        quiz[key] = val;
        this.setState({
            quiz
        })
    }

    componentDidMount() {
        if (this.props.quizId != 0) this.getData();
    }

    getData() {
        $.ajax({
            type: 'get',
            url: `${url}/${this.props.quizId}`
        }).done((quiz) => {
            this.setState({
                quiz
            })
        }).fail((err) => {
            this.props.alert.error(null, err.responseText)
        })
    }

    onSaveSettings() {
        $.ajax({
            type: this.state.quiz.id ? 'PATCH' : 'POST',
            url: `${url}/${this.props.quizId == 0 ? null : this.state.quiz.id}`,
            data: {
                active: this.state.quiz.active,
                shuffle: this.state.quiz.shuffle,
                title: this.state.quiz.title,
                imageId: this.state.quiz.image.id,
                unlockCode: this.state.quiz.unlockCode
            }
        }).done((data) => {
            this.props.alert.success("Quiz updated!")
            this.setState({showEditButtons: true})
            this.props.onQuizSave(this.props.quizId || data, this.state.quiz.title);
        }).fail((err) => {
            this.props.alert.error(null, err.responseText);
        })
    }

    // Hide other edit buttons when a question / quiz is being modified
    onEdit() {
        this.setState({
            showEditButtons: false
        });
    }

    onCancel() {
        // If new quiz, return to index
        if (this.props.quizId == 0) {
            return this.props.onBack();
        }
        // Else reset data
        this.getData();
    }

    onSaveQuestions() {

    }

    render() {
        return (
            <Fragment>
                <h5 className="p-link mt-3" onClick={this.props.onBack.bind(this)}>Back to quizzes</h5>
                <div className="row">

                    {
                        // Left hand side of display - quiz contents
                    }
                    <div className="px-0 col-lg-7">

                        <Card className="bg-trans">
                            <CardHighlight>
                                {this.props.quizTitle ? <h3 className="mt-4 mb-3">{this.props.quizTitle}</h3> : <i className="fad fa-spinner fa-pulse fa-2x"></i>}
                            </CardHighlight>

                            <QuizSettings quiz={this.state.quiz} updateField={this.updateField.bind(this)} onEdit={this.onEdit.bind(this)} onSaveSettings={this.onSaveSettings.bind(this)} onCancel={this.onCancel.bind(this)} />

                            <QuizQuestions questions={this.state.quiz.questions} onEdit={this.onEdit.bind(this)} onSaveQuestions={this.onSaveQuestions.bind(this)} />
                        </Card>

                    </div>

                    {
                        // Right hand side of display - device preview
                    }
                    <div className="col-lg-5 py-1">
                        <div className="m-3 sticky-preview show-large">
                            <DevicePreview sticky>
                                <div>Quiz Preview</div>
                            </DevicePreview>
                        </div>
                    </div>
                </div>
            </Fragment>
        )
    }
}