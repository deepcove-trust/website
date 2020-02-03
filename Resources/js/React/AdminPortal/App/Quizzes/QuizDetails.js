import React, { Component, Fragment } from 'react';
import $ from 'jquery';

import DevicePreview from '../../../Components/DevicePreview';
import Card, { CardHighlight } from '../../../Components/Card';
import QuizSettings from './QuizDetails/QuizSettings';
import QuizQuestions from './QuizDetails/QuizQuestions';
import { ConfirmModal } from '../../../Components/Button';

const url = '/api/admin/app/quizzes';

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

    addQuestion(question) {
        let questions = this.state.quiz.questions;
        questions.push(question);
        this.updateField('questions', questions);
    }

    shiftQuestion(index, shiftUp) {      
        let questions = this.state.quiz.questions;
        if (index == 0 && shiftUp || index == questions.length - 1 && !shiftUp) return;

        let swapIndex = shiftUp ? index - 1 : index + 1;
        [questions[index], questions[swapIndex]] = [questions[swapIndex], questions[index]];
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

    onQuizDelete() {
        $.ajax({
            type: 'delete',
            url: `${url}/${this.state.quiz.id}`
        }).done(() => {
            this.props.onBack()
        }).fail(() => {
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

        let isNew = this.state.editedQuestionIndex == null;
        let indexOfQuestion = this.state.editedQuestionIndex != null ? this.state.editedQuestionIndex : this.state.quiz.questions.length - 1;

        $.ajax({
            type: isNew ? 'post' : 'put',
            url: `${url}/${this.state.quiz.id}/questions/${this.state.quiz.questions[indexOfQuestion].id || null}`,
            contentType: 'application/json',
            data: JSON.stringify(this.state.quiz.questions[indexOfQuestion])
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
                                <ConfirmModal className="btn btn-dark pos-top-right" question="Delete this quiz" confirmPhrase={this.props.quizTitle} cb={this.onQuizDelete.bind(this)}><i className="fas fa-trash"></i>&nbsp; Delete Quiz</ConfirmModal>
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
                                onShiftQuestion={this.shiftQuestion.bind(this)}
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