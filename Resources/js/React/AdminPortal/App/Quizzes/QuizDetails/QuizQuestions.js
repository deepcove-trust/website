import React, { Component, Fragment } from 'react';
import $ from 'jquery';

import { FormGroup, Input, Checkbox, TextArea, Select } from '../../../../Components/FormControl';
import SelectMedia from '../../../../CMS-Blocks/SelectMedia';
import { Button } from '../../../../Components/Button';
import Card, { CardHighlight, CardBody } from '../../../../Components/Card';
import AudioControls from '../../../../Components/Audio';

export default class QuizQuestions extends Component {

    constructor(props) {
        super(props);

        this.state = {

        }
    }

    render() {
        let questionCards = this.props.questions.map((q, index) => {
            return <QuestionCard key={q.id} questionNo={index + 1} question={q} />
        })

        questionCards.push(<NewQuestionCard key="0" />)

        return (
            <Card className="bg-trans">
                <CardHighlight>
                    <h3 className="mt-3">Questions</h3>
                </CardHighlight>
                <CardBody>
                    {questionCards}
                </CardBody>
            </Card>
        )
    }
}

class QuestionCard extends Component {

    componentDidMount() {
        $('.d-square').each(() => { $(this).css('height', $(this).offsetWidth) });
    }

    render() {
        let answerStyleOptions = ['Text Answers', 'Image Answers', 'True Or False'].map((style, index) => {
            return <option key={index} value={style.replace(/\s/g, '')}>{style}</option>
        })

        let questionAudio = this.props.question.audio
            ? <AudioControls className="" file={this.props.question.audio} />
            : (
                <div className="new-something-card" style={{maxHeight: "80px"}}>
                <div><i className="far fa-plus-square fa-2x d-block"></i><small>Add Audio Clip</small></div>
            </div>
            )       

        return (
            <Card className="question-card mb-3">
                <CardHighlight>
                    <h5 className="mt-3 mb-2">{`Question ${this.props.questionNo}`}</h5>
                </CardHighlight>

                <div className="row p-2">
                    <div className="col-lg-7">
                        <FormGroup htmlFor={`question-${this.props.question.id}-text`} label="Question" required>
                            <TextArea rows="3" inputClass="form-control resize-none" id={`question-${this.props.question.id}-text`} value={this.props.question.text} required />
                        </FormGroup>

                        {questionAudio}

                        <QuestionImage displayClass="d-md-none" image={this.props.question.image} />

                        <FormGroup htmlFor={`question-${this.props.question.id}-style`} label="Answers Style" required>
                            <Select id={`question-${this.props.question.id}-style`} formattedOptions={answerStyleOptions} required selected={this.props.question.questionType} />
                        </FormGroup>                       
                    </div>
                    <div className="col-lg-5">
                        <QuestionImage displayClass="d-none d-md-block" image={this.props.question.image}/>
                    </div>
                </div>
            </Card>
            )
    }
}

class NewQuestionCard extends Component {
    render() {
        return (
            <div>
                <div className="w-100 my-2 new-question-card card text-center" onClick={this.props.onAddPending}>
                    <i className="far fa-plus-square fa-5x"></i>
                </div>
            </div>
        )
    }
}

class QuestionImage extends Component {
    render() {
        return (
            this.props.image
                ? (
                    <div className={`bground-primary text-white text-center ${this.props.displayClass}`}>
                        <p className="mt-2 mb-1 font-weight-bold">Question Image</p>
                        <img className="d-square img-fluid object-fit-cover w-100" src={`/media?filename=${this.props.image.filename}`} />
                    </div>
                )
                : (
                    <div className={`new-something-card d-square ${this.props.displayClass}`}>
                        <div>
                            <i className="far fa-plus-square fa-2x d-block"></i>
                            <small>Add Image</small>
                        </div>
                    </div>
                )
            )
    }
}