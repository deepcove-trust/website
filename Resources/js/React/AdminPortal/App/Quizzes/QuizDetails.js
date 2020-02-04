import React, { Component, Fragment } from 'react';
import $ from 'jquery';

import DevicePreview from '../../../Components/DevicePreview';
import Card, { CardHighlight } from '../../../Components/Card';
import QuizSettings from './QuizDetails/QuizSettings';
import QuizQuestions from './QuizDetails/QuizQuestions';
import { ConfirmModal } from '../../../Components/Button';

const url = '/admin/app/quizzes';

export default class QuizDetails extends Component {

    constructor(props) {
        super(props);

        this.state = {
            pendingEdit: !this.props.quizId,
            editedQuestionIndex: null,
            quiz: {
                id: this.props.quizId,
                active: false,
                shuffle: false,
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

    updateQuestion(questionIndex, key, val, ansIndex) {
        let questions = this.state.quiz.questions;
        let question = questions[questionIndex];

        if (ansIndex != null) {
            question[key][ansIndex] = val;
        } else {
            question[key] = val;
        }        

        if (question.questionType == 'TrueOrFalse' && question.trueFalseAnswer == null) {
            question.trueFalseAnswer = 0;
        } else if (question.correctAnswerIndex == null) {
            question.correctAnswerIndex = 0;
            if (question.answers == null || question.answers.length == 0) {
                question.answers = [{}, {}, {}, {}];
            }            
        }
        

        this.updateField('questions', questions);
    }

    deleteQuestion(index) {
        let question = this.state.quiz.questions[index];
        $.ajax({
            type: 'delete',
            url: `${url}/${this.state.quiz.id}/questions/${question.id}`
        }).done(() => {
            this.props.alert.success('Question deleted!');
            this.getData();
        }).fail((err) => {
            this.props.alert.error(null, err.responseText);
        })
    }

    onAddQuestion() {
        let questions = this.state.quiz.questions;
        questions.push({
            id: 0,
            correctAnswerIndex: 0,
            questionType: "TextAnswers",
            text: null,
            answers: [{}, {}, {}, {}],
            image: null,
            audio: null
        });
        this.updateField('questions', questions);
        this.setState({
            pendingEdit: true,
            editedQuestionIndex: questions.length - 1
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
                pendingEdit: false,
                editedQuestionIndex: null,
            });
            this.setQuizState(quiz);
        }).fail((err) => {
            this.props.alert.error(null, err.responseText)
        })
    }

    setQuizState(quiz) {
        quiz.questions.forEach((question) => {           
            question.correctAnswerIndex = question.answers.findIndex((answer) => answer.id == question.correctAnswerId);
        });
        this.setState({
            quiz
        });
    }

    onSaveSettings(cb) {
        $.ajax({
            type: this.state.quiz.id ? 'PATCH' : 'POST',
            url: `${url}${this.props.quizId == 0 ? '' : '/' + this.state.quiz.id}`,
            data: {
                active: this.state.quiz.active,
                shuffle: this.state.quiz.shuffle,
                title: this.state.quiz.title,
                imageId: this.state.quiz.image.id,
                unlockCode: this.state.quiz.unlockCode
            }
        }).done((data) => {
            this.props.alert.success("Quiz updated!")
            this.setState({ pendingEdit: false })
            this.props.onQuizSave(this.props.quizId || data, this.state.quiz.title);
            this.getData();
            if (cb) cb();
        }).fail((err) => {
            this.props.alert.error(null, err.responseText);
        })
    }

    onShiftQuestion(questionId, shiftUp) {
        let shiftDirection = shiftUp ? 'up' : 'down';
        $.ajax({
            type: 'patch',
            url: `${url}/${this.state.quiz.id}/questions/${questionId}?shiftDirection=${shiftDirection}`,            
        }).done(() => {
            this.props.alert.success("Question position updated!");
            this.getData();
        }).fail((err) => {
            this.props.alert.error(null, err.responseText);
        });
    }

    onQuizDelete() {
        $.ajax({
            type: 'delete',
            url: `${url}/${this.state.quiz.id}`
        }).done(() => {
            this.props.alert.success("Quiz deleted!");
            this.props.onBack()
        }).fail((err) => {
            this.props.alert.error(null, err.responseText);
        });
    }

    // Hide other edit buttons when a question / quiz is being modified
    onSettingsEdit() {
        this.setState({
            pendingEdit: true
        });
    }

    onQuestionEdit(questionIndex) {
        this.setState({
            pendingEdit: true,
            editedQuestionIndex: questionIndex
        })
    }

    onCancel() {
        // If new quiz, return to index
        if (this.props.quizId == 0) {
            return this.props.onBack();
        }
        // Else reset data
        this.getData();
    }

    onSaveQuestion(cb) {        
        let questionIndex = this.state.editedQuestionIndex;
        let question = this.state.quiz.questions[questionIndex];
        let isNew = question.id == 0;

        // Strip images away from non image answer questions
        if (question.questionType != "ImageAnswers") question.answers.forEach(a => a.image = null);

        // Strip answers away from true/false questions
        if (question.questionType == "TrueOrFalse") {
            question.answers = null
        } else question.trueFalseAnswer = null;

        $.ajax({
            type: isNew ? 'post' : 'put',
            url: `${url}/${this.state.quiz.id}/questions/${this.state.quiz.questions[questionIndex].id || ''}`,
            contentType: 'application/json',
            data: JSON.stringify(this.state.quiz.questions[questionIndex])
        }).done(() => {
            this.props.alert.success('Question updated!');
            this.getData();
            if (cb) cb();
        }).fail((err) => {
            this.props.alert.error(null, err.responseText);
        })
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
                                {this.props.quizId != 0 ? <ConfirmModal className="btn btn-dark pos-top-right" question="Delete this quiz" confirmPhrase={this.props.quizTitle} cb={this.onQuizDelete.bind(this)}><i className="fas fa-trash"></i>&nbsp; Delete Quiz</ConfirmModal> : null}
                            </CardHighlight>

                            <QuizSettings pendingEdit={this.state.pendingEdit}
                                mustSaveSettingsFirst={this.props.quizId == 0}
                                quiz={this.state.quiz} updateField={this.updateField.bind(this)}
                                onEdit={this.onSettingsEdit.bind(this)} onSaveSettings={this.onSaveSettings.bind(this)}
                                onCancel={this.onCancel.bind(this)} />

                            <QuizQuestions pendingEdit={this.state.pendingEdit}
                                mustSaveSettingsFirst={this.props.quizId == 0}
                                questions={this.state.quiz.questions}
                                onEdit={this.onQuestionEdit.bind(this)}
                                onSaveQuestion={this.onSaveQuestion.bind(this)}
                                onUpdateQuestion={this.updateQuestion.bind(this)}
                                onCancel={this.onCancel.bind(this)}
                                onDeleteQuestion={this.deleteQuestion.bind(this)}
                                onShiftQuestion={this.onShiftQuestion.bind(this)}
                                onAddQuestion={this.onAddQuestion.bind(this)}
                            />
                        </Card>

                    </div>

                    {
                        // Right hand side of display - device preview
                    }
                    <div className="col-lg-5 py-1">
                        <div className="m-3 sticky-preview show-large text-center">
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